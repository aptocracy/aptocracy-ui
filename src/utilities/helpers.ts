import dayjs from "dayjs";
import {
  EMPTY_STRING,
  MESSAGE_TYPE,
} from "../common/constants/common.constants";
import {
  MemberStatus,
  OrgActions,
  OrganizationType,
  ParamType,
  ProposalState,
} from "../common/enums/org.enum";
import {
  IGovernance,
  IMemberInfo,
  IOption,
  IRoleConfig,
  IRoleInfo,
} from "../common/interfaces/org.interfaces";
import { provider } from "../program/utils";
import { createNotification } from "./notification";
import { useMemo } from "react";
import { BCS } from "aptos";

export function uploadImage(
  acceptedFiles: any,
  reader: FileReader,
  fieldValue: string,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
) {
  if (!acceptedFiles[0]) {
    return;
  }
  reader.readAsDataURL(acceptedFiles[0]);
  reader.onload = async () => {
    const base64ImgFormat: any = reader.result;
    setFieldValue(fieldValue, base64ImgFormat);
  };
}

export function getTrimmedPublicKey(publicKey: string): string {
  const publicKeyString = publicKey.toString();
  return (
    publicKeyString.substring(0, 5) +
    "..." +
    publicKeyString.substring(publicKeyString.length - 5)
  );
}

export function checkActionForRole(
  members: IMemberInfo[] | undefined,
  userAddr: string | undefined,
  action: OrgActions,
  roleConfig: IRoleInfo[],
  memberRole?: string
): boolean {
  let role =
    memberRole ??
    members?.find((item) => item.memberAddress === userAddr)?.role;
  let roleInfo = roleConfig.find((item) => item.name === role);
  if (!roleInfo) return false;
  return roleInfo.actions.includes(action);
}

export function validateQuorumValues(quorum: number | undefined) {
  if (!quorum) {
    return "Quorum can not be empty";
  }
  if (quorum && (quorum < 0 || quorum > 100)) {
    return "Quorum must be between 0 and 100";
  }
  return EMPTY_STRING;
}

export function validateMaxVotingTime(value: number | undefined) {
  if (!value) {
    return "Max voting time can not be empty";
  }
  if (value && value <= 0) {
    return "Max voting time can not be zero or less";
  }
  return EMPTY_STRING;
}

export const calculateVotingPower = async (
  orgType: OrganizationType,
  depositedAmount: number,
  roleWeight: number,
  address: string,
  nfts: number
) => {
  switch (orgType) {
    case OrganizationType.DepositBased:
      return depositedAmount;
    case OrganizationType.RoleBased:
      return roleWeight;
    case OrganizationType.NftBased:
      return nfts;
  }
};

export const getProposalStateLabel = (proposalState: ProposalState) => {
  switch (proposalState) {
    case ProposalState.Cancelled:
      return "Cancelled";
    case ProposalState.Completed:
      return "Completed";
    case ProposalState.Defeated:
      return "Defeated";
    case ProposalState.Executing:
      return "Executing";
    case ProposalState.Succeeded:
      return "Succeeded";
    case ProposalState.Voting:
      return "Voting";
  }
};

export const setupVotingTime = (maxVotingTime: number, createdAt: number) => {
  const now = dayjs().unix();

  let votingTime = new Date(createdAt * 1000);
  votingTime.setSeconds(maxVotingTime + votingTime.getSeconds());
  let votingUnix = Math.floor(votingTime.getTime() / 1000);

  let timeToVoteEnd = votingUnix - now;

  if (timeToVoteEnd <= 0) {
    return null;
  }

  const days = Math.floor(timeToVoteEnd / 86400);
  timeToVoteEnd -= days * 86400;

  const hours = Math.floor(timeToVoteEnd / 3600) % 24;
  timeToVoteEnd -= hours * 3600;

  const minutes = Math.floor(timeToVoteEnd / 60) % 60;
  timeToVoteEnd -= minutes * 60;
  const seconds = Math.floor(timeToVoteEnd % 60);

  return { days, hours, minutes, seconds };
};

export const getLocalDateFormat = (unixDate: number) => {
  return new Date(unixDate * 1000).toLocaleDateString();
};

export const trimAccountAddress = (address: string) => {
  const startAddress = "0x";
  const addressArray = address.split(startAddress);
  let trimmedAddress = addressArray[1].replace(/^0+/, "");
  const updatedAddress = startAddress.concat(...trimmedAddress.toString());
  return updatedAddress;
};

export const copyItemToClipboard = async (item: string, message: string) => {
  await navigator.clipboard.writeText(item);
  createNotification(MESSAGE_TYPE.SUCCESS, message);
};

export const getOrgTypeText = (orgType: OrganizationType): string => {
  switch (orgType) {
    case OrganizationType.DepositBased: {
      return "Deposit based";
    }
    case OrganizationType.RoleBased: {
      return "Role based";
    }
    case OrganizationType.NftBased: {
      return "NFT based";
    }
    default: {
      return EMPTY_STRING;
    }
  }
};

export const getGovernanceOptions = (
  governances: IGovernance[] | undefined
): IOption[] | undefined => {
  return governances?.map((item, index) => {
    return {
      value: item.governanceId,
      label: `Governance #${item.governanceId}: Quorum (${
        item.quorum
      }), Approval qourum (${item.approvalQuorum}), Max voting time (${
        item.maxVotingTime / 24 / 60 / 60
      } days)${item.earlyTipping ? ", Early tipping" : EMPTY_STRING}`,
      isFixed: false,
    };
  });
};

export const getActionTitle = (item: OrgActions) => {
  switch (item) {
    case OrgActions.CancelProposal:
      return "Cancel proposal";
    case OrgActions.CastVote:
      return "Cast vote";
    case OrgActions.CreateChangeGovernanceConfig:
      return "Create change governance config proposal";
    case OrgActions.CreateGovernance:
      return "Create governance";
    case OrgActions.CreateProposal:
      return "Create proposal";
    case OrgActions.CreateTreasury:
      return "Create treasury";
    case OrgActions.FinalizeVotes:
      return "Finalize votes";
    case OrgActions.InviteMember:
      return "Invite member";
    case OrgActions.SupportOrg:
      return "Support organization";
    case OrgActions.RelinquishVote:
      return "Relinquish vote";
    case OrgActions.UpdateMainGovernance:
      return "Update main governance";
    case OrgActions.UpdateMainTreasury:
      return "Update main treasury";
    case OrgActions.ChangeGovernanceConfig:
      return "Change governance config";
  }
};

export const getMemberStatusLabel = (status: MemberStatus) => {
  switch (status) {
    case MemberStatus.Accepted:
      return "Accepted";
    case MemberStatus.Pending:
      return "Pending";
    case MemberStatus.Rejected:
      return "Rejected";
    case MemberStatus.Cancelled:
      return "Cancelled";
  }
};

export const serializeValuBasedOnType = (value: string, type: ParamType) => {
  switch (type) {
    case ParamType.Address:
      let address = value;
      if (value.startsWith("0x")) {
        let valueArr = value.split("0x");
        address = valueArr[1];
      }
      return [...Buffer.from(address, "hex")];
    case ParamType.String:
      return [...BCS.bcsSerializeStr(value)];
    case ParamType.U8:
      return [...BCS.bcsSerializeU16(Number(value))];
    case ParamType.U16:
      return [...BCS.bcsSerializeU8(Number(value))];
    case ParamType.U32:
      return [...BCS.bcsSerializeU32(Number(value))];
    case ParamType.U64:
      return [...BCS.bcsSerializeUint64(Number(value))];
    case ParamType.Bool:
      return [...BCS.bcsSerializeBool(JSON.parse(value))];
    case ParamType.Bytes:
      return [...BCS.bcsSerializeBytes(JSON.parse(value))];
  }
};

export const sleep = (ttl: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ttl));
