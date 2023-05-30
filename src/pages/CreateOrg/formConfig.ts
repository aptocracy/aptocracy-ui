import {
  EMPTY_STRING,
  MEMBER_ORGANIZATION_ACTION_OPTIONS,
  OWNER_ORGANIZATION_ACTION_OPTIONS,
} from "../../common/constants/common.constants";
import { OrganizationType } from "../../common/enums/org.enum";

export const formModel = {
  formId: "create-org-form",
  formFields: {
    name: {
      name: "name",
      label: "Organization name",
      initialValue: EMPTY_STRING,
    },
    description: {
      name: "description",
      label: "Organization description",
      initialValue: EMPTY_STRING,
    },
    orgImg: {
      name: "orgImg",
      label: "Organization image",
      initialValue: EMPTY_STRING,
    },
    orgType: {
      name: "orgType",
      label: "Organization type",
      initialValue: OrganizationType.DepositBased,
    },
    inviteOnly: {
      name: "inviteOnly",
      label: "Is invite only?",
      initialValue: true,
    },
    totalNfts: {
      name: "totalNfts",
      label: "Total nfts for votes",
      initialValue: EMPTY_STRING,
    },
    collectionName: {
      name: "collectionName",
      label: "Collection name",
      initialValue: EMPTY_STRING,
    },
    creatorAddress: {
      name: "creatorAddress",
      label: "Creator address",
      initialValue: EMPTY_STRING,
    },
    roleConfig: {
      name: "roleConfig",
      label: "Role config",
      initialValue: [
        {
          roleName: "Owner",
          roleWeight: EMPTY_STRING,
          roleActions: OWNER_ORGANIZATION_ACTION_OPTIONS.filter(
            (item) => item.isFixed
          ).map((item) => Number(item.value)),
          isPredefined: true,
        },
        {
          roleName: "Member",
          roleWeight: EMPTY_STRING,
          roleActions: MEMBER_ORGANIZATION_ACTION_OPTIONS.filter(
            (item) => item.isFixed
          ).map((item) => Number(item.value)),
          isPredefined: true,
        },
      ],
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
    treasuryMaxVotingTime: {
      name: "treasuryMaxVotingTime",
      label: "Max voting time",
      initialValue: EMPTY_STRING,
    },
    treasuryApprovalQuorum: {
      name: "treasuryApprovalQuorum",
      label: "Approval quorum",
      initialValue: EMPTY_STRING,
    },
    treasuryQuorum: {
      name: "treasuryQuorum",
      label: "Quorum",
      initialValue: EMPTY_STRING,
    },
    treasuryEarlyTipping: {
      name: "treasuryEarlyTipping",
      label: "Early tipping",
      initialValue: false,
    },
  },
};
