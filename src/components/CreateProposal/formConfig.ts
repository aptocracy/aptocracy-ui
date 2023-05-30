import { EMPTY_STRING } from "../../common/constants/common.constants";
import { ProposalType } from "../../common/enums/org.enum";

export const formModel = {
  formId: "create-proposal",
  formFields: {
    proposalType: {
      name: "proposalType",
      label: "Proposal type",
      initialValue: ProposalType.Discussion,
    },
    title: {
      name: "title",
      label: "Title",
      initialValue: EMPTY_STRING,
    },
    description: {
      name: "description",
      label: "Description",
      initialValue: EMPTY_STRING,
    },
    discussionLink: {
      name: "discussionLink",
      label: "External discussion URL",
      initialValue: EMPTY_STRING,
    },
    proposalOptions: {
      name: "proposalOptions",
      label: "Vote options",
      initialValue: [],
    },
    maxVoterOptions: {
      name: "maxVoterOptions",
      label: "Max voter options",
      initialValue: EMPTY_STRING,
    },
    transferAddress: {
      name: "transferAddress",
      label: "Transfer address",
      initialValue: EMPTY_STRING,
    },
    transferAmount: {
      name: "transferAmount",
      label: "Transfer amount",
      initialValue: EMPTY_STRING,
    },
    withdrawalAmount: {
      name: "withdrawalAmount",
      label: "Withdrawal amount",
      initialValue: EMPTY_STRING,
    },
    mainGovernace: {
      name: "mainGovernance",
      label: "Main governance",
      initialValue: EMPTY_STRING,
    },
    mainTreasury: {
      name: "mainTreasury",
      label: "Main treasury",
      initialValue: EMPTY_STRING,
    },
    maxVotingTime: {
      name: "maxVotingTime",
      label: "Max voting time",
      initialValue: EMPTY_STRING,
    },
    approvalQuorum: {
      name: "approvalQuorum",
      label: "Approval quorum",
      initialValue: EMPTY_STRING,
    },
    quorum: {
      name: "quorum",
      label: "Quorum",
      initialValue: EMPTY_STRING,
    },
    earlyTipping: {
      name: "earlyTipping",
      label: "Early tipping",
      initialValue: false,
    },
    customOption: {
      name: "customOption",
      label: "Vote option",
      initialValue: EMPTY_STRING,
    },
    scriptHash: {
      name: "scriptHash",
      label: "Script hash",
      initialValue: EMPTY_STRING,
    },
    scriptBytecode: {
      name: "scriptBytecode",
      label: "Script bytecode (String)",
      initialValue: EMPTY_STRING,
    },
    scriptParams: {
      name: "scriptParams",
      label: "Script parameters definition",
      initialValue: [],
    },
  },
};
