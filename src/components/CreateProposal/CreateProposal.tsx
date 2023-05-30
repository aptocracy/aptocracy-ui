import { Form, Formik } from "formik";
import React, { FC, useMemo, useState } from "react";
import {
  ICreateTreasuryProposalFields,
  IGovernance,
  IOrganizationBasicData,
  IProposalInfo,
  ISelectOption,
  ITreasury,
} from "../../common/interfaces/org.interfaces";
import MainButton from "../MainButton/MainButton";
import Modal from "../Modal/Modal";
import CreateProposalForm from "./CreateProposalForm/CreateProposalForm";
import { formModel } from "./formConfig";
import "./CreateProposal.scss";
import {
  createChangeGovernanceProposal,
  createCustomProposal,
  createDiscussionProposal,
  createTransferProposal,
  createUpdateMainGovernanceProposal,
  createUpdateMainTreasuryProposal,
  createWithdrawalProposal,
} from "../../program/methods/proposals";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { validateCreateProposalForm } from "./validator";
import {
  getLatestProposalForOrganizationFromApi,
  getSingleProposalForOrganizationFromApi,
  getSingleProposalsForTreasuryFromApi,
} from "../../api/graphql";
import { createNotification } from "../../utilities/notification";
import {
  MESSAGE_TYPE,
  treasuryProposalOptions,
} from "../../common/constants/common.constants";
import { ProposalType } from "../../common/enums/org.enum";
import { organizationStore } from "../../state/organizationStore";

const CreateProposal: FC<{
  closeModal: () => void;
  treasury: ITreasury | undefined;
  proposals: IProposalInfo[] | undefined;
  setProposals: (proposals: IProposalInfo[]) => void;
  proposalTypeOptions: ISelectOption[];
  governances?: IGovernance[];
  treasuries?: ITreasury[];
}> = ({
  closeModal,
  treasury,
  proposals,
  setProposals,
  proposalTypeOptions,
  governances,
  treasuries,
}) => {
  const { signAndSubmitTransaction } = useWallet();
  const { organizationBasicInfo } = organizationStore();
  const initialValues: ICreateTreasuryProposalFields = useMemo(() => {
    return {
      description: formModel.formFields.description.initialValue,
      discussionLink: formModel.formFields.discussionLink.initialValue,
      maxVoterOptions: formModel.formFields.maxVoterOptions.initialValue,
      proposalOptions: formModel.formFields.proposalOptions.initialValue,
      proposalType: Number(proposalTypeOptions[0].value),
      title: formModel.formFields.title.initialValue,
      transferAddress: formModel.formFields.transferAddress.initialValue,
      withdrawalAmount: formModel.formFields.withdrawalAmount.initialValue,
      transferAmount: formModel.formFields.transferAmount.initialValue,
      mainGovernance: formModel.formFields.mainGovernace.initialValue,
      mainTreasury: formModel.formFields.mainTreasury.initialValue,
      approvalQuorum: formModel.formFields.approvalQuorum.initialValue,
      quorum: formModel.formFields.quorum.initialValue,
      earlyTipping: formModel.formFields.earlyTipping.initialValue,
      maxVotingTime: formModel.formFields.maxVotingTime.initialValue,
      scriptBytecode: formModel.formFields.scriptBytecode.initialValue,
      scriptHash: formModel.formFields.scriptHash.initialValue,
      scriptParams: formModel.formFields.scriptParams.initialValue,
      customOption: formModel.formFields.customOption.initialValue,
    };
  }, []);

  const submitForm = async (values: ICreateTreasuryProposalFields) => {
    try {
      if (!treasury) throw new Error("Main treasury not defined");
      switch (values.proposalType) {
        case ProposalType.Discussion:
          await createDiscussionProposal(
            treasury.aptocracyAddress,
            treasury.treasuryAddress,
            values.title,
            values.description,
            values.proposalOptions,
            values.discussionLink,
            Number(values.maxVoterOptions),
            signAndSubmitTransaction
          );
          break;
        case ProposalType.Transfer:
          await createTransferProposal(
            treasury.aptocracyAddress,
            treasury.treasuryAddress,
            values.title,
            values.description,
            values.discussionLink,
            values.transferAddress,
            Number(values.transferAmount),
            signAndSubmitTransaction
          );
          break;
        case ProposalType.Withdrawal:
          await createWithdrawalProposal(
            treasury.aptocracyAddress,
            treasury.treasuryAddress,
            values.title,
            values.description,
            values.discussionLink,
            Number(values.withdrawalAmount),
            signAndSubmitTransaction
          );
          break;
        case ProposalType.UpdateMainGovernance:
          if (!organizationBasicInfo?.mainGovernance)
            throw new Error("Main governance not defined");
          await createUpdateMainGovernanceProposal(
            treasury.aptocracyAddress,
            Number(values.mainGovernance),
            values.title,
            values.description,
            values.discussionLink,
            signAndSubmitTransaction
          );
          break;
        case ProposalType.UpdateMainTreasury: {
          if (!organizationBasicInfo?.mainGovernance)
            throw new Error("Main governance not defined");
          const newMainTreasury = treasuries?.find(
            (item) => item.treasuryIndex === Number(values.mainTreasury)
          );
          if (!newMainTreasury) return;
          await createUpdateMainTreasuryProposal(
            treasury.aptocracyAddress,
            newMainTreasury.treasuryAddress,
            values.title,
            values.description,
            values.discussionLink,
            signAndSubmitTransaction
          );
          break;
        }
        case ProposalType.ChangeGovernanceConfig: {
          if (!organizationBasicInfo?.mainGovernance)
            throw new Error("Main governance not defined");
          await createChangeGovernanceProposal(
            treasury.aptocracyAddress,
            Number(values.quorum),
            Number(values.approvalQuorum),
            Number(values.maxVotingTime),
            values.earlyTipping,
            Number(values.mainGovernance),
            values.title,
            values.description,
            values.discussionLink,
            signAndSubmitTransaction
          );
          break;
        }
        case ProposalType.UserDefined: {
          await createCustomProposal(
            values.scriptHash,
            values.scriptBytecode,
            values.scriptParams,
            values.customOption,
            treasury.aptocracyAddress,
            values.title,
            values.description,
            values.discussionLink,
            treasury.treasuryAddress,
            signAndSubmitTransaction
          );
          break;
        }
      }
      let updatedProposals = proposals ? [...proposals] : [];

      const newProposa = await getLatestProposalForOrganizationFromApi(
        treasury.aptocracyAddress
      );
      console.log(newProposa, "NEW PROPOSAL");
      updatedProposals.unshift(newProposa);
      setProposals(updatedProposals);
      createNotification(MESSAGE_TYPE.SUCCESS, "Proposal successfully created");

      closeModal();
    } catch (error: any) {
      console.log(error);
      createNotification(
        MESSAGE_TYPE.ERROR,
        `Failed to create proposal`,
        error?.message
      );
    }
  };

  return (
    <Modal closeModal={closeModal} title="Create proposal">
      <Formik
        initialValues={initialValues}
        onSubmit={submitForm}
        validate={async (values) =>
          await validateCreateProposalForm(values, treasury?.treasuryAddress)
        }
        validateOnBlur
      >
        {(values) => {
          return (
            <Form id={formModel.formId}>
              <CreateProposalForm
                proposalTypeOptions={proposalTypeOptions}
                governances={governances}
                treasuries={treasuries}
              />
              <div className="create-proposal__actions">
                <MainButton
                  type="button"
                  onClick={() => {
                    closeModal();
                  }}
                  light
                >
                  Cancel
                </MainButton>
                <MainButton type="submit" onClick={() => {}}>
                  Create proposal
                </MainButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default CreateProposal;
