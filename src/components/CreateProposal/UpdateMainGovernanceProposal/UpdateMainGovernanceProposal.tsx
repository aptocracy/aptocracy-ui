import { useFormikContext } from "formik";
import React, { FC, useMemo } from "react";
import {
  IGovernance,
  IOption,
} from "../../../common/interfaces/org.interfaces";
import { getGovernanceOptions } from "../../../utilities/helpers";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";

const UpdateMainGovernanceProposal: FC<{ governances?: IGovernance[] }> = ({
  governances,
}) => {
  const governanceOptions: IOption[] | undefined = useMemo(() => {
    return getGovernanceOptions(governances);
  }, [governances]);

  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">Custom</p>
      <FormField
        name={formModel.formFields.mainGovernace.name}
        placeholder={formModel.formFields.mainGovernace.label}
        type="select"
        options={governanceOptions}
      />
    </div>
  );
};

export default UpdateMainGovernanceProposal;
