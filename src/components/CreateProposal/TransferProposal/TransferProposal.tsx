import React, { FC } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";

const TransferProposal: FC = () => {
  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">Funds</p>
      <FormField
        name={formModel.formFields.transferAddress.name}
        placeholder={formModel.formFields.transferAddress.label}
        type="text"
      />
      <FormField
        name={formModel.formFields.transferAmount.name}
        placeholder={formModel.formFields.transferAmount.label}
        type="text"
      />
    </div>
  );
};

export default TransferProposal;
