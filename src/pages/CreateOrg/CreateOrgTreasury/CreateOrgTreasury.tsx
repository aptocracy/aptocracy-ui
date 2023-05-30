import React from "react";
import FormField from "../../../components/FormField/FormField";
import { formModel } from "../formConfig";

const CreateOrgTreasury = () => {
  return (
    <div className="create-org-governance">
      <p className="create-org-governance__title">
        Create treasury and define treasury rules:{" "}
      </p>
      <FormField
        name={formModel.formFields.treasuryQuorum.name}
        type="number"
        placeholder={formModel.formFields.treasuryQuorum.label}
      />
      <FormField
        name={formModel.formFields.treasuryApprovalQuorum.name}
        type="number"
        placeholder={formModel.formFields.treasuryApprovalQuorum.label}
      />
      <FormField
        name={formModel.formFields.treasuryMaxVotingTime.name}
        type="number"
        placeholder={formModel.formFields.treasuryMaxVotingTime.label}
      />
      <FormField
        name={formModel.formFields.treasuryEarlyTipping.name}
        type="switch"
        placeholder={formModel.formFields.treasuryEarlyTipping.label}
        label={formModel.formFields.treasuryEarlyTipping.label}
      />
    </div>
  );
};

export default CreateOrgTreasury;
