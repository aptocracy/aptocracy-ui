import React, { FC, Fragment, useEffect, useState } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import "./Proposals.scss";
import { treasuryStore } from "../../../state/treasuryStore";
import { getAlTreasuryProposalsFromApi } from "../../../api/graphql";
import { checkActionForRole } from "../../../utilities/helpers";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { OrgActions } from "../../../common/enums/org.enum";
import { treasuryProposalOptions } from "../../../common/constants/common.constants";
import CreateProposal from "../../../components/CreateProposal/CreateProposal";
import ProposalItem from "../../../components/ProposalItem/ProposalItem";

const Proposals: FC = () => {
  const [createProposalModalActive, toggleCreateProposalModal] =
    useState(false);

  const { account } = useWallet();
  const {
    treasury,
    setProposals,
    proposals,
    memberRights,
    organizationBasicInfo,
    treasuryGovernance,
    updateProposal,
  } = treasuryStore();

  useEffect(() => {
    treasury && void getProposalsInfo();
  }, [treasury]);

  const getProposalsInfo = async () => {
    try {
      if (!treasury) return;
      const allTreasuryProposals = await getAlTreasuryProposalsFromApi(
        treasury.treasuryAddress
      );
      setProposals(allTreasuryProposals);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {createProposalModalActive && (
        <CreateProposal
          closeModal={() => toggleCreateProposalModal(false)}
          proposals={proposals}
          treasury={treasury}
          setProposals={setProposals}
          proposalTypeOptions={treasuryProposalOptions}
        />
      )}
      <div className="proposals">
        <div className="proposals__header">
          <h4 className="proposals__title">Treasury proposals:</h4>
          {organizationBasicInfo && (
            <MainButton
              onClick={() => toggleCreateProposalModal(true)}
              type="button"
              disabled={
                !checkActionForRole(
                  undefined,
                  account?.address,
                  OrgActions.CreateProposal,
                  organizationBasicInfo?.roleConfig,
                  memberRights?.role
                )
              }
            >
              Create proposal
            </MainButton>
          )}
        </div>
        {proposals?.map((item) => (
          <ProposalItem
            proposal={item}
            governance={treasuryGovernance}
            memberRole={memberRights?.role}
            organizationBasicInfo={organizationBasicInfo}
            treasury={treasury}
            updateProposal={updateProposal}
            memberNftsInfo={memberRights?.memberNftsInfo}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default Proposals;
