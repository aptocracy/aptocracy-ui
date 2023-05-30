import { OrgActions, ParamType, ProposalType } from "../enums/org.enum";
import { IOption, ISelectOption } from "../interfaces/org.interfaces";

export const EMPTY_STRING = "";
export const CREATE_ORG_TOTAL_STEPS = 6;

export const APTOS_COIN_ADDRESS = "0x1::aptos_coin::AptosCoin";

export const COIN_STORE_APTOS_COIN =
  "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

export const OWNER_ORGANIZATION_ACTION_OPTIONS: IOption[] = [
  {
    label: "Change governance config",
    value: OrgActions.ChangeGovernanceConfig,
    isFixed: true,
  },
  {
    label: "Create governance",
    value: OrgActions.CreateGovernance,
    isFixed: true,
  },
  {
    label: "Create proposal",
    value: OrgActions.CreateProposal,
    isFixed: true,
  },
  {
    label: "Cancel proposal",
    value: OrgActions.CancelProposal,
    isFixed: true,
  },
  {
    label: "Cast vote",
    value: OrgActions.CastVote,
    isFixed: true,
  },
  {
    label: "Create change governance config proposa",
    value: OrgActions.CreateChangeGovernanceConfig,
    isFixed: true,
  },
  {
    label: "Create treasury",
    value: OrgActions.CreateTreasury,
    isFixed: true,
  },
  {
    label: "Invite member",
    value: OrgActions.InviteMember,
    isFixed: true,
  },
  {
    label: "Finalize votes",
    value: OrgActions.FinalizeVotes,
    isFixed: true,
  },
  {
    label: "Relinquish vote",
    value: OrgActions.RelinquishVote,
    isFixed: true,
  },
  {
    label: "Support organization",
    value: OrgActions.SupportOrg,
    isFixed: true,
  },
  {
    label: "Update main governance",
    value: OrgActions.UpdateMainGovernance,
    isFixed: true,
  },
  {
    label: "Update main treasury",
    value: OrgActions.UpdateMainTreasury,
    isFixed: true,
  },
];
export const MEMBER_ORGANIZATION_ACTION_OPTIONS: IOption[] = [
  {
    label: "Create proposal",
    value: OrgActions.CreateProposal,
    isFixed: false,
  },
  {
    label: "Cancel proposal",
    value: OrgActions.CancelProposal,
    isFixed: false,
  },
  {
    label: "Cast vote",
    value: OrgActions.CastVote,
    isFixed: true,
  },
  {
    label: "Create change governance config proposa",
    value: OrgActions.CreateChangeGovernanceConfig,
    isFixed: false,
  },
  {
    label: "Create governance",
    value: OrgActions.CreateGovernance,
    isFixed: false,
  },
  {
    label: "Create treasury",
    value: OrgActions.CreateTreasury,
    isFixed: false,
  },
  {
    label: "Invite member",
    value: OrgActions.InviteMember,
    isFixed: false,
  },
  {
    label: "Finalize votes",
    value: OrgActions.FinalizeVotes,
    isFixed: true,
  },
  {
    label: "Relinquish vote",
    value: OrgActions.RelinquishVote,
    isFixed: true,
  },
  {
    label: "Support organization",
    value: OrgActions.SupportOrg,
    isFixed: true,
  },
  {
    label: "Update main governance",
    value: OrgActions.UpdateMainGovernance,
    isFixed: false,
  },
  {
    label: "Update main treasury",
    value: OrgActions.UpdateMainTreasury,
    isFixed: false,
  },
  {
    label: "Change governance config",
    value: OrgActions.ChangeGovernanceConfig,
    isFixed: false,
  },
];
export const CUSTOM_ORGANIZATION_ACTION_OPTIONS: IOption[] = [
  {
    label: "Create proposal",
    value: OrgActions.CreateProposal,
    isFixed: false,
  },
  {
    label: "Cancel proposal",
    value: OrgActions.CancelProposal,
    isFixed: false,
  },
  {
    label: "Cast vote",
    value: OrgActions.CastVote,
    isFixed: false,
  },
  {
    label: "Create change governance config proposa",
    value: OrgActions.CreateChangeGovernanceConfig,
    isFixed: false,
  },
  {
    label: "Create governance",
    value: OrgActions.CreateGovernance,
    isFixed: false,
  },
  {
    label: "Create treasury",
    value: OrgActions.CreateTreasury,
    isFixed: false,
  },
  {
    label: "Invite member",
    value: OrgActions.InviteMember,
    isFixed: false,
  },
  {
    label: "Finalize votes",
    value: OrgActions.FinalizeVotes,
    isFixed: false,
  },
  {
    label: "Relinquish vote",
    value: OrgActions.RelinquishVote,
    isFixed: false,
  },
  {
    label: "Support organization",
    value: OrgActions.SupportOrg,
    isFixed: false,
  },
  {
    label: "Update main governance",
    value: OrgActions.UpdateMainGovernance,
    isFixed: false,
  },
  {
    label: "Update main treasury",
    value: OrgActions.UpdateMainTreasury,
    isFixed: false,
  },
  {
    label: "Change governance config",
    value: OrgActions.ChangeGovernanceConfig,
    isFixed: false,
  },
];

export const MESSAGE_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

export const APT_DECIMALS = 100000000;

export const treasuryProposalOptions: ISelectOption[] = [
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Discussion",
    value: ProposalType.Discussion,
  },
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Withdrawal",
    value: ProposalType.Withdrawal,
  },
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Transfer",
    value: ProposalType.Transfer,
  },
  {
    description: "Define your own proposal with execution script",
    title: "Custom",
    value: ProposalType.UserDefined,
  },
];

export const organizationProposalOptions: ISelectOption[] = [
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Update main governance",
    value: ProposalType.UpdateMainGovernance,
  },
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Update main treasury",
    value: ProposalType.UpdateMainTreasury,
  },
  {
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    title: "Change governance config",
    value: ProposalType.ChangeGovernanceConfig,
  },
];

export const paramTypeOptions: IOption[] = [
  {
    isFixed: false,
    label: "u8",
    value: ParamType.U8,
  },
  {
    isFixed: false,
    label: "u16",
    value: ParamType.U16,
  },
  {
    isFixed: false,
    label: "u32",
    value: ParamType.U32,
  },
  {
    isFixed: false,
    label: "u64",
    value: ParamType.U64,
  },
  {
    isFixed: false,
    label: "address",
    value: ParamType.Address,
  },
  {
    isFixed: false,
    label: "String",
    value: ParamType.String,
  },
  {
    isFixed: false,
    label: "bool",
    value: ParamType.Bool,
  },
  {
    isFixed: false,
    label: "vector<u8>",
    value: ParamType.Bytes,
  },
];
