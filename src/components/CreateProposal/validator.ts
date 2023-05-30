import {
  APTOS_COIN_ADDRESS,
  APT_DECIMALS,
  EMPTY_STRING,
} from "../../common/constants/common.constants";
import { ProposalType } from "../../common/enums/org.enum";
import { ICreateTreasuryProposalFields } from "../../common/interfaces/org.interfaces";
import { provider } from "../../program/utils";

export const validateCreateProposalForm = (
  values: ICreateTreasuryProposalFields,
  treasuryAddress?: string
) => {
  const errors: any = {};
  if (values.title === EMPTY_STRING) {
    errors.title = "Title can not be empty";
  }
  if (values.description === EMPTY_STRING) {
    errors.description = "Description can not be empty";
  }

  switch (values.proposalType) {
    case ProposalType.Discussion:
      validateDiscussionProposalFields(values, errors);
      break;
    case ProposalType.Transfer:
      validateTransferProposalFields(values, errors, treasuryAddress);
      break;
    case ProposalType.Withdrawal:
      validateWithdrawalProposalFields(values, errors, treasuryAddress);
      break;
    case ProposalType.ChangeGovernanceConfig:
      validateChangeGovernanceConfig(values, errors);
      break;
    case ProposalType.UserDefined:
      validateUserDefinedProposalFields(values, errors);
      break;
  }
  return errors;
};

const validateDiscussionProposalFields = (
  values: ICreateTreasuryProposalFields,
  errors: any
) => {
  if (values.maxVoterOptions === EMPTY_STRING) {
    errors.maxVoterOptions = "Max voter options can not be empty";
  }
  if (Number(values.maxVoterOptions) <= 0) {
    errors.maxVoterOptions = "Max voter options can not be zero or less";
  }
  if (Number(values.maxVoterOptions) > values.proposalOptions.length) {
    errors.maxVoterOptions =
      "Max voter options can not be higher then number of proposal opptions";
  }
};

const validateTransferProposalFields = async (
  values: ICreateTreasuryProposalFields,
  errors: any,
  treasuryAddress?: string
) => {
  if (values.transferAddress === EMPTY_STRING) {
    errors.transferAddress = "Transfer address can not be empty";
  }
  if (values.transferAmount === EMPTY_STRING) {
    errors.transferAmount = "Transfer amount can not be empty";
  }
  if (Number(values.transferAmount) <= 0) {
    errors.transferAmount = "Transfer amount can not be zero or less";
  }
};

const validateWithdrawalProposalFields = async (
  values: ICreateTreasuryProposalFields,
  errors: any,
  treasuryAddress?: string
) => {
  if (values.withdrawalAmount === EMPTY_STRING) {
    errors.withdrawalAmount = "Withdrawal amount can not be empty";
  }
  if (Number(values.withdrawalAmount) <= 0) {
    errors.withdrawalAmount = "Withdrawal amount can not be zero or less";
  }
};

const validateChangeGovernanceConfig = (
  values: ICreateTreasuryProposalFields,
  errors: any
) => {
  if (values.approvalQuorum === EMPTY_STRING) {
    errors.approvalQuorum = "Approval quorum can not be empty";
  }
  if (
    Number(values.approvalQuorum) < 0 ||
    Number(values.approvalQuorum) > 100
  ) {
    errors.approvalQuorum = "Approval quorum must be between 0 and 100";
  }
  if (values.quorum === EMPTY_STRING) {
    errors.quorum = "Quorum can not be empty";
  }
  if (Number(values.quorum) < 0 || Number(values.quorum) > 100) {
    errors.quorum = "Quorummust be between 0 and 100";
  }
  if (values.maxVotingTime === EMPTY_STRING) {
    errors.maxVotingTime = "Max voting time can not be empty";
  }
  if (Number(values.maxVotingTime) <= 0) {
    errors.maxVotingTime = "Max voting time can not be zero or less";
  }
};

const validateUserDefinedProposalFields = (
  values: ICreateTreasuryProposalFields,
  errors: any
) => {
  if (values.discussionLink === EMPTY_STRING) {
    errors.discussionLink = "Script link can not be empty";
  }
  if (values.scriptBytecode === EMPTY_STRING) {
    errors.scriptBytecode = "Script bytecode can not be empty";
  }
  if (values.scriptHash === EMPTY_STRING) {
    errors.scriptHash = "Script hash can not be empty";
  }

  if (values.customOption === EMPTY_STRING) {
    errors.customOption = "Vote option can not be empty";
  }

  values.scriptParams.forEach((item, index) => {
    if (item.paramValue === EMPTY_STRING) {
      errors[`scriptParams.${index}.paramValue`] =
        "Parameter value can not be empty";
    }
  });
};
