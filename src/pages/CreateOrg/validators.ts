import { EMPTY_STRING } from "../../common/constants/common.constants";
import { CreateOrgSteps, OrganizationType } from "../../common/enums/org.enum";
import { ICreateOrgFields } from "../../common/interfaces/org.interfaces";

export const validateCreateOrganizationForm = (
  values: ICreateOrgFields,
  activeStep: CreateOrgSteps
) => {
  const errors: any = {};
  switch (activeStep) {
    case CreateOrgSteps.BasicInfo:
      validateBasicInfoStep(values, errors);
      return errors;
    case CreateOrgSteps.OrgType:
      validateOrgTypeStep(values, errors);
      return errors;
    case CreateOrgSteps.RoleConfig:
      valdiateRoleConfig(values, errors);
      return errors;
    case CreateOrgSteps.OrganizationRules:
      validateOrgRules(values, errors);
      return errors;
    case CreateOrgSteps.Treasury:
      validateTreasuryRules(values, errors);
      return errors;
    default:
      return errors;
  }
};

const validateBasicInfoStep = (values: ICreateOrgFields, errors: any) => {
  if (values.name === EMPTY_STRING) {
    errors.name = "Organization name can not be empty";
  }
  if (values.description === EMPTY_STRING) {
    errors.description = "Organization description can not be empty";
  }
};

const validateOrgTypeStep = async (values: ICreateOrgFields, errors: any) => {
  if (values.orgType === OrganizationType.NftBased) {
    if (values.collectionName === EMPTY_STRING) {
      errors.collectionName = "Collection name can not be empty";
    }
    if (values.totalNfts === EMPTY_STRING) {
      errors.totalNfts = "Total nfts  can not be empty";
    }
    if (values.creatorAddress === EMPTY_STRING) {
      errors.creatorAddress = "Creator can not be empty";
    }
  }
};

const valdiateRoleConfig = (values: ICreateOrgFields, errors: any) => {
  values.roleConfig.forEach((item, index) => {
    if (item.roleName === EMPTY_STRING) {
      errors[`roleConfig.${index}.roleName`] = "Role name can not be empty";
    }
    if (values.orgType === OrganizationType.RoleBased) {
      if (Number(item.roleWeight) <= 0) {
        errors[`roleConfig.${index}.roleWeight`] =
          "Role weight can not be zero or less";
      }
      if (item.roleWeight === EMPTY_STRING) {
        errors[`roleConfig.${index}.roleWeight`] =
          "Role weight can not be empty";
      }
    }
    if (
      values.roleConfig.filter(
        (checkItem) => checkItem.roleName === item.roleName
      ).length > 1
    ) {
      errors[`roleConfig.${index}.roleName`] =
        "Role with given name already exists";
    }
  });
};

const validateOrgRules = (values: ICreateOrgFields, errors: any) => {
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

const validateTreasuryRules = (values: ICreateOrgFields, errors: any) => {
  if (values.treasuryApprovalQuorum === EMPTY_STRING) {
    errors.treasuryApprovalQuorum = "Approval quorum can not be empty";
  }
  if (
    Number(values.treasuryApprovalQuorum) < 0 ||
    Number(values.treasuryApprovalQuorum) > 100
  ) {
    errors.treasuryApprovalQuorum = "Approval quorum must be between 0 and 100";
  }
  if (values.treasuryQuorum === EMPTY_STRING) {
    errors.treasuryQuorum = "Quorum can not be empty";
  }
  if (
    Number(values.treasuryQuorum) < 0 ||
    Number(values.treasuryQuorum) > 100
  ) {
    errors.treasuryQuorum = "Quorummust be between 0 and 100";
  }
  if (values.treasuryMaxVotingTime === EMPTY_STRING) {
    errors.treasuryMaxVotingTime = "Max voting time can not be empty";
  }
  if (Number(values.treasuryMaxVotingTime) <= 0) {
    errors.treasuryMaxVotingTime = "Max voting time can not zero or less";
  }
};
