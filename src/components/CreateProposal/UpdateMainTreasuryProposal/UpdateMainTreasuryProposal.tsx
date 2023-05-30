import React, { FC, useMemo } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";
import { ITreasury, IOption } from "../../../common/interfaces/org.interfaces";
import { useFormikContext } from "formik";

const UpdateMainTreasuryProposal: FC<{ treasuries?: ITreasury[] }> = ({
  treasuries,
}) => {
  const { setFieldValue } = useFormikContext();

  const treasuriesOptions: IOption[] | undefined = useMemo(() => {
    return treasuries?.map((item, index) => {
      return {
        value: item.treasuryIndex,
        label: `Treasury #${item.treasuryIndex}`,
        isFixed: false,
      };
    });
  }, [treasuries]);

  return (
    <div className="create-proposal-form__specific-fields">
      <p className="create-proposal-form__label">Custom</p>
      <FormField
        name={formModel.formFields.mainTreasury.name}
        placeholder={formModel.formFields.mainTreasury.label}
        type="select"
        options={treasuriesOptions}
        onChange={(e: any) => {
          setFieldValue(formModel.formFields.mainTreasury.name, e.value);
        }}
      />
    </div>
  );
};

export default UpdateMainTreasuryProposal;
