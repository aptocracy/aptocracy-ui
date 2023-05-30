import React, { FC } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";

const WithdrawalProposal: FC = () => {
  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">Withdrawal</p>
      <FormField
        name={formModel.formFields.withdrawalAmount.name}
        placeholder={formModel.formFields.withdrawalAmount.label}
        type="text"
      />
    </div>
  );
};

export default WithdrawalProposal;
