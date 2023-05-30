import React, { useEffect, useMemo, useState } from "react";
import { organizationStore } from "../../../state/organizationStore";
import {
  getAllGovernancesFromApi,
  getAllOrganizationProposalsFromApi,
  getAllProposalsForTreasuryFromApi,
  getAllTreasuriesFromApi,
  getDepositRecordsForTreasury,
} from "../../../api/graphql";
import { ProposalTypeNames } from "../../../common/enums/org.enum";
import GovernanceItem from "../../../components/GovernanceItem/GovernanceItem";
import "./OrgProposals.scss";
import { getTrimmedPublicKey } from "../../../utilities/helpers";
import { IMemberRights } from "../../../common/interfaces/org.interfaces";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getMemberRightsForTreasury } from "../../../program/methods/organization";
import ProposalItem from "../../../components/ProposalItem/ProposalItem";
import MainButton from "../../../components/MainButton/MainButton";
import addRoleIcon from "../../../assets/add_circle.svg";
import SetupMainGovernance from "./SetupMainGovernance/SetupMainGovernance";
import SetupMainTreasury from "./SetupMainTreasury/SetupMainTreasury";

const OrgProposals = () => {
  const {
    organizationBasicInfo,
    setProposals,
    organizationProposals,
    treasuries,
    governances,
    members,
    updateProposal,
    setGovernancesInfo,
    setTreasuryInfo,
  } = organizationStore();

  const [mainTreasuryMemberRights, setMainTreasuryMemberRights] =
    useState<IMemberRights>();
  const [mainGovModalActive, toggleMainGovModal] = useState(false);
  const [mainTreasuryModalActive, toggleMainTreasuryModal] = useState(false);

  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    void getProposalsInfo();
  }, [organizationBasicInfo, account, governances, treasuries]);

  const getProposalsInfo = async () => {
    try {
      if (
        !organizationBasicInfo?.mainTreasury ||
        !organizationBasicInfo.mainGovernance
      )
        return;
      const allOrgProposalsProposals = await getAllOrganizationProposalsFromApi(
        organizationBasicInfo.address
      );
      const depositRecords = await getDepositRecordsForTreasury(
        organizationBasicInfo.mainTreasury
      );
      const mainTreasury = treasuries?.find(
        (item) => item.treasuryAddress === organizationBasicInfo.mainTreasury
      );
      const mainGovernance = governances?.find(
        (item) => item.governanceId === organizationBasicInfo.mainGovernance
      );

      const memberInfo = members?.find(
        (item) => item.memberAddress === account?.address
      );

      if (mainTreasury && mainGovernance && memberInfo && depositRecords) {
        const memberRIghts = await getMemberRightsForTreasury(
          mainTreasury,
          memberInfo,
          depositRecords,
          organizationBasicInfo
        );
        setMainTreasuryMemberRights(memberRIghts);
      }

      setProposals(allOrgProposalsProposals);
    } catch (error) {
      console.log(error);
    }
  };

  const mainTreasuryInfo = useMemo(() => {
    return treasuries?.find(
      (item) => item.treasuryAddress === organizationBasicInfo?.mainTreasury
    );
  }, [treasuries, organizationBasicInfo]);

  const mainGovernanceInfo = useMemo(() => {
    return governances?.find(
      (item) => item.governanceId === organizationBasicInfo?.mainGovernance
    );
  }, [treasuries, organizationBasicInfo]);

  return (
    <div>
      {mainGovModalActive && (
        <SetupMainGovernance closeModal={() => toggleMainGovModal(false)} />
      )}
      {mainTreasuryModalActive && (
        <SetupMainTreasury closeModal={() => toggleMainTreasuryModal(false)} />
      )}
      <div className="org-proposals__rules">
        <p>Organization rules</p>
        {mainGovernanceInfo ? (
          <GovernanceItem
            isMain
            item={mainGovernanceInfo}
            title={`Governance #${mainGovernanceInfo.governanceId}`}
          />
        ) : (
          <MainButton
            onClick={() => {
              toggleMainGovModal(true);
            }}
            type="button"
            light
          >
            <img src={addRoleIcon} alt="Add role" />
            Set up main governance
          </MainButton>
        )}
        {mainTreasuryInfo ? (
          <div className="org-proposals__main-treasury">
            <div>
              <p>Main treasury</p>
              <p className="org-proposals__treasury-address">
                {getTrimmedPublicKey(mainTreasuryInfo.treasuryAddress)}
              </p>
            </div>
            {mainTreasuryMemberRights && (
              <div className="org-proposals__info">
                <div>
                  <p className="org-proposals__info-label">Your deposit</p>
                  <p>{mainTreasuryMemberRights.depositAmount} APT</p>
                </div>
                <div>
                  <p className="org-proposals__info-label">Your ownership</p>
                  <p>{mainTreasuryMemberRights.ownership}%</p>
                </div>
                <div>
                  <p className="org-proposals__info-label">Your voting power</p>
                  <p>{mainTreasuryMemberRights.votingPower} </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <MainButton
            onClick={() => toggleMainTreasuryModal(true)}
            type="button"
            light
          >
            <img src={addRoleIcon} alt="Add role" />
            Set up main treasury
          </MainButton>
        )}
      </div>
      {organizationProposals && organizationProposals?.length > 0 && (
        <div>
          <p>Proposals</p>
          {organizationProposals?.map((item) => (
            <ProposalItem
              governance={mainGovernanceInfo}
              memberRole={mainTreasuryMemberRights?.role}
              organizationBasicInfo={organizationBasicInfo}
              proposal={item}
              treasury={mainTreasuryInfo}
              updateProposal={updateProposal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgProposals;
