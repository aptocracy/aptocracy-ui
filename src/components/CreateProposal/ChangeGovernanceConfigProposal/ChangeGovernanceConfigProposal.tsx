import React, { FC, useMemo } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";
import {
  IGovernance,
  IOption,
} from "../../../common/interfaces/org.interfaces";
import { getGovernanceOptions } from "../../../utilities/helpers";
import { useFormikContext } from "formik";

const ChangeGovernanceConfigProposal: FC<{
  governances?: IGovernance[];
}> = ({ governances }) => {
  const { setFieldValue } = useFormikContext();

  const governanceOptions: IOption[] | undefined = useMemo(() => {
    return getGovernanceOptions(governances);
  }, [governances]);

  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">Custom </p>
      <FormField
        name={formModel.formFields.mainGovernace.name}
        placeholder={formModel.formFields.mainGovernace.label}
        type="select"
        options={governanceOptions}
        onChange={(e: any) => {
          let governance = governances?.find(
            (item) => item.governanceId === e.value
          );
          setFieldValue(formModel.formFields.quorum.name, governance?.quorum);
          setFieldValue(
            formModel.formFields.earlyTipping.name,
            governance?.earlyTipping
          );
          setFieldValue(
            formModel.formFields.approvalQuorum.name,
            governance?.approvalQuorum
          );
          setFieldValue(
            formModel.formFields.maxVotingTime.name,
            governance?.maxVotingTime &&
              governance?.maxVotingTime / 24 / 60 / 60
          );
        }}
      />
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

export default ChangeGovernanceConfigProposal;
