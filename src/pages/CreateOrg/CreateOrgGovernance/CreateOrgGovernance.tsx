import { useFormikContext } from "formik";
import React, { FC } from "react";
import { ICreateOrgFields } from "../../../common/interfaces/org.interfaces";
import FormField from "../../../components/FormField/FormField";
import { formModel } from "../formConfig";

const CreateOrgGovernance: FC = () => {
  return (
    <div className="create-org-governance">
      <p className="create-org-governance__title">
        Define organization rules:{" "}
      </p>
      <FormField
        name={formModel.formFields.quorum.name}
        type="number"
        placeholder={formModel.formFields.quorum.label}
      />
      <FormField
        name={formModel.formFields.approvalQuorum.name}
        type="number"
        placeholder={formModel.formFields.approvalQuorum.label}
      />
      <FormField
        name={formModel.formFields.maxVotingTime.name}
        type="number"
        placeholder={formModel.formFields.maxVotingTime.label}
      />
      <FormField
        name={formModel.formFields.earlyTipping.name}
        type="switch"
        placeholder={formModel.formFields.earlyTipping.label}
        label={formModel.formFields.earlyTipping.label}
      />
    </div>
  );
};

export default CreateOrgGovernance;
