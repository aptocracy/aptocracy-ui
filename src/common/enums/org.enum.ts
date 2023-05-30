export enum OrganizationType {
  RoleBased,
  DepositBased,
  NftBased,
}

export enum CreateOrgSteps {
  BasicInfo,
  OrgType,
  RoleConfig,
  OrganizationRules,
  Treasury,
  Preview,
}

//ISPRAVITI REDOSLED
export enum OrgActions {
  ChangeGovernanceConfig = 0,
  CreateGovernance = 1,
  InviteMember = 2,
  UpdateMainGovernance = 3,
  CreateTreasury = 4,
  SupportOrg = 5,
  CastVote = 6,
  CancelProposal = 7,
  FinalizeVotes = 8,
  RelinquishVote = 9,
  CreateProposal = 10,
  CreateChangeGovernanceConfig = 11,
  UpdateMainTreasury = 12,
}

export enum TransactionState {
  Pending,
  Loading,
  Succeeded,
  Failed,
}

export enum OrganizationDetailsTabs {
  Members = "Members",
  Treasuries = "Treasuries",
  Governances = "Governances",
  Roles = "Roles",
  Proposals = "Proposals",
}

export enum MemberStatus {
  Pending,
  Accepted,
  Rejected,
  Cancelled,
}

export enum ProposalType {
  Discussion,
  Transfer,
  Withdrawal,
  UserDefined,
  UpdateMainTreasury,
  UpdateMainGovernance,
  ChangeGovernanceConfig,
}

export enum ProposalState {
  Voting,
  Succeeded,
  Executing,
  Completed,
  Cancelled,
  Defeated,
}

export enum ProposalTypeNames {
  Discussion = "Discussion",
  Transfer = "Transfer",
  Withdrawal = "Withdrawal",
  UserDefined = "UserDefined",
  UpdateMainTreasury = "UpdateMainTreasury",
  UpdateMainGovernance = "UpdateMainGovernance",
  ChangeGovernanceConfig = "ChangeGovernanceConfig",
}

export enum ParamType {
  U8 = "u8",
  U16 = "u16",
  U32 = "u32",
  U64 = "u64",
  String = "String",
  Bool = "bool",
  Address = "address",
  Bytes = "vector<u8>",
}
