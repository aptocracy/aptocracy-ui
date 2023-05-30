import React, { FC } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";

const DiscussionProposal: FC = () => {
  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">
        Choose vote options for proposal:{" "}
      </p>
      <FormField
        name={formModel.formFields.proposalOptions.name}
        placeholder={formModel.formFields.proposalOptions.label}
        type="creatable-select"
      />
      <FormField
        name={formModel.formFields.maxVoterOptions.name}
        placeholder={formModel.formFields.maxVoterOptions.label}
        type="text"
      />
    </div>
  );
};

export default DiscussionProposal;
