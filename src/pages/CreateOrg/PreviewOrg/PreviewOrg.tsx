import { useFormikContext } from "formik";
import React from "react";
import { EMPTY_STRING } from "../../../common/constants/common.constants";
import { OrganizationType } from "../../../common/enums/org.enum";
import { ICreateOrgFields } from "../../../common/interfaces/org.interfaces";
import LabelCard from "../../../components/LabelCard/LabelCard";
import avatar from "../../../assets/coverImg.png";
import "./PreviewOrg.scss";

const PreviewOrg = () => {
  const { values } = useFormikContext<ICreateOrgFields>();

  console.log(values);
  const getOrgType = () => {
    switch (values.orgType) {
      case OrganizationType.DepositBased:
        return "Deposit based";
      case OrganizationType.RoleBased:
        return "Role based";
      case OrganizationType.NftBased:
        return "NFT based";
    }
  };
  return (
    <div className="preview-org">
      <div className="preview-org__header">
        <img
          src={values.orgImg !== EMPTY_STRING ? values.orgImg : avatar}
          alt="Org image"
        />
        <h3>{values.name}</h3>
        <p>{values.description}</p>
      </div>
      <LabelCard description={getOrgType()} label="Organization type" />
      <LabelCard
        description={`${values.roleConfig.map((item) => ` ${item.roleName}`)} `}
        label="Roles"
      />
      <LabelCard
        description={`Quorum (${values.quorum}), Approval qourum (${
          values.approvalQuorum
        }), Max voting time (${values.maxVotingTime} days), ${
          values.earlyTipping ? "Early tipping" : EMPTY_STRING
        }`}
        label="Organization rules"
      />
      <LabelCard
        description={`Quorum (${values.treasuryQuorum}), Approval qourum (${
          values.approvalQuorum
        }), Max voting time (${values.treasuryMaxVotingTime} days), ${
          values.treasuryEarlyTipping ? "Early tipping" : EMPTY_STRING
        }`}
        label="Treasury rules"
      />
    </div>
  );
};

export default PreviewOrg;
