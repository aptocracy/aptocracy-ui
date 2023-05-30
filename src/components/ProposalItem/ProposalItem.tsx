import React, { FC, useEffect, useState } from "react";
import "./ProposalItem.scss";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  getAlTreasuryProposalsFromApi,
  getAllGovernancesFromApi,
  getAllTreasuriesFromApi,
  getGovernanceId,
  getOrganizationBasicDataFromApi,
  getSingleProposalForOrganizationFromApi,
  getSingleProposalsForTreasuryFromApi,
} from "../../api/graphql";
import {
  MESSAGE_TYPE,
  EMPTY_STRING,
  APTOS_COIN_ADDRESS,
  COIN_STORE_APTOS_COIN,
} from "../../common/constants/common.constants";
import {
  ProposalState,
  OrgActions,
  ProposalType,
  ProposalTypeNames,
} from "../../common/enums/org.enum";
import {
  IProposalInfo,
  ITreasury,
  IOrganizationBasicData,
  IGovernance,
  IMemberNftInfo,
} from "../../common/interfaces/org.interfaces";
import {
  castVote,
  relinquishVote,
  cancelProposal,
  finalizeVotes,
} from "../../program/methods/proposals";
import {
  checkActionForRole,
  setupVotingTime,
  getProposalStateLabel,
  sleep,
} from "../../utilities/helpers";
import { createNotification } from "../../utilities/notification";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import MainButton from "../MainButton/MainButton";
import Chip from "../Chip/Chip";
import { executeProposal } from "../../api/executeScripts";
import { treasuryStore } from "../../state/treasuryStore";
import { provider } from "../../program/utils";
import { organizationStore } from "../../state/organizationStore";

const ProposalItem: FC<{
  proposal: IProposalInfo;
  treasury: ITreasury | undefined;
  organizationBasicInfo: IOrganizationBasicData | undefined;
  governance: IGovernance | undefined;
  updateProposal: (proposalId: IProposalInfo) => void;
  memberRole: string | undefined;
  memberNftsInfo?: IMemberNftInfo[];
}> = ({
  proposal,
  organizationBasicInfo,
  governance,
  updateProposal,
  treasury,
  memberNftsInfo,
  memberRole,
}) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isExecuting, toggleExecution] = useState(false);
  //Use only for update after execution for treasury proposals
  const { setTreasuryBalance } = treasuryStore();
  //Use only for update after execution for org proposals
  const { setGovernancesInfo, setTreasuryInfo, setOrganizationBasicInfo } =
    organizationStore();

  const [selectedOptions, updateSeletedOptions] = useState<string[]>(
    proposal.voteRecords.find(
      (item) => account && item.memberAddress === account?.address
    )?.electedOptions ?? []
  );

  useEffect(() => {
    updateSeletedOptions(
      proposal.voteRecords.find(
        (item) => account && item.memberAddress === account?.address
      )?.electedOptions ?? []
    );
  }, [proposal, account]);

  const renderProposalActionButton = () => {
    switch (proposal.state) {
      case ProposalState.Voting:
        //Finalize votes if max voting time is reached
        if (!votingTimeToEnd) {
          return (
            <MainButton
              onClick={finalizeVotesHandler}
              type="button"
              disabled={
                !organizationBasicInfo ||
                !checkActionForRole(
                  undefined,
                  account?.address,
                  OrgActions.FinalizeVotes,
                  organizationBasicInfo.roleConfig,
                  memberRole
                )
              }
            >
              Finalize votes
            </MainButton>
          );
        }
        //Relinquish vote if voter already voted
        return (
          <MainButton
            onClick={
              !userVoteRecord ? voteForProposal : relinquishVoteForProposal
            }
            type="button"
            disabled={
              !organizationBasicInfo ||
              !checkActionForRole(
                undefined,
                account?.address,
                !userVoteRecord
                  ? OrgActions.CastVote
                  : OrgActions.RelinquishVote,
                organizationBasicInfo.roleConfig,
                memberRole
              )
            }
          >
            {!userVoteRecord ? "Vote" : "Relinquish vote"}
          </MainButton>
        );
      case ProposalState.Succeeded:
        //TODO: execute transfer and withdrawal proposal
        if (
          proposal.voteOptions.find((item) => item.executionSteps.length > 0)
        ) {
          return (
            <MainButton
              onClick={executeProposalHandler}
              type="button"
              submitting={isExecuting}
            >
              Execute
            </MainButton>
          );
        }
    }
  };

  const executeProposalHandler = async () => {
    try {
      toggleExecution(true);
      if (account?.address && treasury) {
        await executeProposal(
          account?.address,
          proposal.voteOptions[0].executionSteps[0].id
        );
        //Wait for indexer
        await sleep(1000);
        await updateInfoAfterExecution();
        updateProposal(
          await getSingleProposalForOrganizationFromApi(
            treasury.aptocracyAddress,
            proposal.proposalId
          )
        );
        createNotification(
          MESSAGE_TYPE.SUCCESS,
          "Successfully executeds proposal"
        );
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to execute proposa");
    } finally {
      toggleExecution(false);
    }
  };

  const updateInfoAfterExecution = async () => {
    try {
      switch (proposal.proposalType) {
        case ProposalTypeNames.Transfer:
        case ProposalTypeNames.Withdrawal: {
          const treasuryBalance: any = await provider.getAccountResource(
            proposal.treasuryAddress,
            COIN_STORE_APTOS_COIN
          );
          if (Number(treasuryBalance.data.coin.value) !== undefined) {
            setTreasuryBalance(treasuryBalance.data.coin.value);
          }
          break;
        }
        case ProposalTypeNames.ChangeGovernanceConfig: {
          //Update only one governance
          const organizationInfo: IOrganizationBasicData =
            await getOrganizationBasicDataFromApi(proposal.aptocracyAddress);
          setOrganizationBasicInfo(organizationInfo);
          setGovernancesInfo(
            await getAllGovernancesFromApi(proposal.aptocracyAddress)
          );
          break;
        }
        case ProposalTypeNames.UpdateMainGovernance: {
          //Update only one governance
          const organizationInfo: IOrganizationBasicData =
            await getOrganizationBasicDataFromApi(proposal.aptocracyAddress);
          setOrganizationBasicInfo(organizationInfo);
          setGovernancesInfo(
            await getAllGovernancesFromApi(proposal.aptocracyAddress)
          );
          break;
        }
        case ProposalTypeNames.UpdateMainTreasury: {
          //Update only one treasury
          const organizationInfo: IOrganizationBasicData =
            await getOrganizationBasicDataFromApi(proposal.aptocracyAddress);
          setOrganizationBasicInfo(organizationInfo);
          setTreasuryInfo(
            await getAllTreasuriesFromApi(proposal.aptocracyAddress)
          );
          break;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const voteForProposal = async () => {
    try {
      if (!treasury) return;
      await castVote(
        treasury?.aptocracyAddress,
        proposal.treasuryAddress,
        proposal.proposalId,
        selectedOptions,
        memberNftsInfo?.map((item) => item.tokenName) ?? [],
        memberNftsInfo?.map((item) => item.tokenPropertyVersion) ?? [],
        signAndSubmitTransaction
      );

      updateProposal(
        await getSingleProposalForOrganizationFromApi(
          treasury.aptocracyAddress,
          proposal.proposalId
        )
      );

      createNotification(MESSAGE_TYPE.SUCCESS, "Successfully voted");
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to vote on proposal");
    }
  };

  const relinquishVoteForProposal = async () => {
    try {
      if (!treasury) return;
      await relinquishVote(
        treasury.aptocracyAddress,
        treasury.treasuryAddress,
        proposal.proposalId,
        signAndSubmitTransaction
      );
      updateProposal(
        await getSingleProposalForOrganizationFromApi(
          treasury.aptocracyAddress,
          proposal.proposalId
        )
      );
      createNotification(MESSAGE_TYPE.SUCCESS, "Successfully relinquish vote");
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to relinquish vote");
    }
  };

  const cancelProposalHandler = async () => {
    try {
      if (!treasury) return;
      await cancelProposal(
        treasury.aptocracyAddress,
        proposal.proposalId,
        signAndSubmitTransaction
      );
      updateProposal(
        await getSingleProposalForOrganizationFromApi(
          treasury.aptocracyAddress,
          proposal.proposalId
        )
      );
      createNotification(
        MESSAGE_TYPE.SUCCESS,
        "Successfully cancelled proposal"
      );
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to cancel proposal");
    }
  };

  const finalizeVotesHandler = async () => {
    try {
      if (!treasury) return;
      await finalizeVotes(
        treasury.aptocracyAddress,
        proposal.proposalId,
        signAndSubmitTransaction
      );
      updateProposal(
        await getSingleProposalForOrganizationFromApi(
          treasury.aptocracyAddress,
          proposal.proposalId
        )
      );
      createNotification(MESSAGE_TYPE.SUCCESS, "Successfully finalized votes");
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to finalize votes");
    }
  };

  const userVoteRecord = proposal.voteRecords.find((item) => {
    return account && item.memberAddress === account?.address;
  });

  const votingTimeToEnd =
    governance &&
    setupVotingTime(governance?.maxVotingTime, proposal.createdAt);

  const calculateVotePercengate = (voteWeight: number) => {
    const percentage =
      voteWeight > 0 ? (voteWeight * 100) / proposal.maxVoteWeight : 0;
    return percentage > 100 ? 100 : percentage;
  };

  return (
    <div className="proposal-item">
      <div className="proposal-item__header">
        <div className="proposal-item__type-and-time">
          <Chip text={proposal.proposalType} fontSize={0.75} />
          <p className="proposal-item__time">
            {votingTimeToEnd
              ? `${votingTimeToEnd.days}d ${votingTimeToEnd.hours}h ${votingTimeToEnd.minutes}m`
              : EMPTY_STRING}
          </p>
        </div>
        <Chip
          backgroundColor="#c3f5e8"
          text={getProposalStateLabel(proposal.state)}
          fontSize={0.75}
        />
      </div>
      <p className="proposal-item__name">{proposal.name}</p>
      <p className="proposal-item__description">{proposal.description}</p>
      <div className="proposal-item__options">
        <p className="proposal-item__options-label">Chose options to vote</p>
        <p className="proposal-item__max-options-info">
          (maximum {proposal.maxVoterOptions} option)
        </p>

        {proposal.voteOptions.map((item) => (
          <div className="proposal-item__option">
            <CustomCheckbox
              checked={
                !!selectedOptions.find((option) => item.option === option)
              }
              disabled={
                !!userVoteRecord ||
                ProposalState.Voting !== proposal.state ||
                !account
              }
              onClickMethod={() => {
                let newOptions = [...selectedOptions];
                if (selectedOptions.includes(item.option)) {
                  newOptions = newOptions.filter(
                    (option) => item.option !== option
                  );
                } else {
                  if (newOptions.length < proposal.maxVoterOptions) {
                    newOptions.push(item.option);
                  }
                }
                updateSeletedOptions(newOptions);
              }}
            />
            <p className="proposal-item__option-name">{item.option}</p>
            <p className="proposal-item__option-votes">
              Votes: <span>{calculateVotePercengate(item.voteWeight)}%</span>
            </p>
          </div>
        ))}
        <div className="proposal-item__actions">
          {proposal.state === ProposalState.Voting &&
            organizationBasicInfo &&
            votingTimeToEnd &&
            checkActionForRole(
              undefined,
              account?.address,
              OrgActions.CancelProposal,
              organizationBasicInfo?.roleConfig,
              memberRole
            ) && (
              <MainButton onClick={cancelProposalHandler} type="button" light>
                Cancel proposal
              </MainButton>
            )}
          {renderProposalActionButton()}
        </div>
      </div>
    </div>
  );
};

export default ProposalItem;
