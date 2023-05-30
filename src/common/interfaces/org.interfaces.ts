import {
  OrgActions,
  OrganizationType,
  ProposalState,
  ProposalType,
  TransactionState,
} from "../enums/org.enum";

export interface ICreateOrgFields {
  name: string;
  description: string;
  orgImg: string;
  orgType: OrganizationType;
  inviteOnly: boolean;
  totalNfts: number | string;
  collectionName: string;
  creatorAddress: string;
  roleConfig: IRoleConfig[];
  maxVotingTime: number | string;
  approvalQuorum: number | string;
  quorum: number | string;
  earlyTipping: boolean;
  treasuryMaxVotingTime: number | string;
  treasuryApprovalQuorum: number | string;
  treasuryQuorum: number | string;
  treasuryEarlyTipping: boolean;
}

export interface IRoleConfig {
  roleName: string;
  roleWeight: number | string;
  roleActions: OrgActions[];
  isPredefined: boolean;
}

export interface IOption {
  value: number | string;
  label: string;
  isFixed: boolean;
  type?: number;
}

export interface ISelectOption {
  value: string | number;
  title: string;
  description: string;
}

export interface ITransactionInfo {
  payload: any;
  description: string;
  number: number;
  transactionState: TransactionState;
  txid?: string;
}

export interface IOrganizationBasicData {
  address: string;
  name: string;
  creator: string;
  defaultRole: string;
  governingCoin: string;
  governingCollectionInfo: IGoverningCollectionInfo;
  inviteOnly: boolean;
  mainGovernance: number;
  maxVoterWeight: number;
  orgType: OrganizationType;
  treasuryCount: number;
  roleConfig: IRoleInfo[];
  createdAt: number;
  image: string;
  description: string;
  mainTreasury?: string;
}

export interface IGoverningCollectionInfo {
  creator?: string;
  name?: string;
}

export interface IRoleInfo {
  name: string;
  actions: OrgActions[];
  roleWeight: number;
}

export interface IMemberInfo {
  memberAddress: string;
  aptocracyAddress: string;
  role: string;
  status: number;
  proposalCreated: number;
  memberData: IUserInfo;
}
export interface IUserInfo {
  userAddress: string;
  name: string;
  email: string;
  socials: ISocialNetwork[];
}

export interface ISocialNetwork {
  socialType: number;
  url: string;
}

export interface IGovernance {
  aptocracyAddress: string;
  governanceId: number;
  maxVotingTime: number;
  quorum: number;
  approvalQuorum: number;
  earlyTipping: number;
  validFrom: number;
  validTo: number;
}

export interface IAddNewMembersFields {
  invitations: IInvitation[];
}

export interface IInvitation {
  address: string;
  role: string;
}

export interface ITreasury {
  treasuryAddress: string;
  aptocracyAddress: string;
  authority: string;
  treasuryIndex: number;
  depositedAmount: number;
  treasuryCoin: string;
  governanceId: number;
}

export interface IDepositRecord {
  treasuryAddress: string;
  memberAddress: string;
  aptocracyAddress: string;
  accumulatedAmount: number;
  lastDeposit: Date;
}

export interface IMemberRights {
  depositAmount: number;
  ownership: number;
  votingPower: number;
  role: string;
  memberNftsInfo: IMemberNftInfo[];
}

export interface IMemberNftInfo {
  tokenName: string;
  tokenPropertyVersion: number;
}

export interface ICreateTreasuryProposalFields {
  proposalType: ProposalType;
  title: string;
  description: string;
  discussionLink: string;
  proposalOptions: string[]; //think about this
  maxVoterOptions: number | string;
  transferAddress: string;
  transferAmount: number | string;
  withdrawalAmount: number | string;
  mainGovernance: number | string;
  mainTreasury: string;
  maxVotingTime: number | string;
  approvalQuorum: number | string;
  quorum: number | string;
  earlyTipping: boolean;
  scriptHash: string;
  scriptBytecode: string;
  scriptParams: IScriptParams[];
  customOption: string;
}
export interface IScriptParams {
  paramValue: string;
  paramType: string;
}
export interface IProposalInfo {
  proposalId: number;
  treasuryAddress: string;
  aptocracyAddress: string;
  name: string;
  description: string;
  discussionLink: string;
  creator: string;
  maxVoteWeight: number;
  cancelledAt: Date;
  createdAt: number;
  earlyTipping: boolean;
  executedAt: Date;
  maxVoterOptions: number;
  state: ProposalState;
  voteThreshold: string;
  votingFinalizedAt: Date;
  voteOptions: IVoteOption[];
  voteRecords: IVoteRecord[];
  proposalType: string;
}

export interface IVoteOption {
  option: string;
  voteWeight: number;
  optionElected: boolean;
  executionSteps: IExecutionSteps[];
}

export interface IExecutionSteps {
  executionHash: string;
  executionParameters: string;
  executionParameterTypes: string;
  executed: boolean;
  id: string;
}

export interface IVoteRecord {
  memberAddress: string;
  proposalId: number;
  treasuryAddress: string;
  voterWeight: number;
  electedOptions: string[];
  votedAt: Date;
}
