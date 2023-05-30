import React, { Fragment, useCallback } from "react";
import FormField from "../../FormField/FormField";
import { formModel } from "../formConfig";
import "./CustomProposal.scss";
import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik";
import { ICreateTreasuryProposalFields } from "../../../common/interfaces/org.interfaces";
import addRoleIcon from "../../../assets/add_circle.svg";
import close from "../../../assets/close.svg";
import MainButton from "../../MainButton/MainButton";
import {
  EMPTY_STRING,
  paramTypeOptions,
} from "../../../common/constants/common.constants";

const CustomProposal = () => {
  const { values } = useFormikContext<ICreateTreasuryProposalFields>();

  const addNewParam = (arrayHelpers: FieldArrayRenderProps) => {
    arrayHelpers.push({
      paramValue: EMPTY_STRING,
      paramType: EMPTY_STRING,
    });
  };

  const removeOption = useCallback(
    (index: number, arrayHelpers: FieldArrayRenderProps) => {
      arrayHelpers.remove(index);
    },
    []
  );

  return (
    <div>
      <p className="custom-proposal__title">Execution script information</p>
      <FormField
        name={formModel.formFields.customOption.name}
        placeholder={formModel.formFields.customOption.label}
        type="text"
      />
      <FormField
        name={formModel.formFields.scriptHash.name}
        placeholder={formModel.formFields.scriptHash.label}
        type="text"
      />
      <FormField
        name={formModel.formFields.scriptBytecode.name}
        placeholder={formModel.formFields.scriptBytecode.label}
        type="text"
      />
      <FieldArray
        name={formModel.formFields.scriptParams.name}
        render={(arrayHelpers) => (
          <Fragment>
            <div className="custom-proposal__header">
              <p className="custom-proposal__label">
                Script parameters definition
              </p>
              <button
                onClick={() => addNewParam(arrayHelpers)}
                type="button"
                className="custom-proposal__add-button"
              >
                <img src={addRoleIcon} alt="Add role" />
                Add parameter
              </button>
            </div>

            {values.scriptParams.map((item, index) => (
              <div className="custom-proposal__script-params">
                <div className="custom-proposal__script-params-item">
                  <div className="custom-proposal__script-param-value">
                    <FormField
                      name={`scriptParams.${index}.paramValue`}
                      placeholder={"Param value"}
                      type="text"
                    />
                  </div>{" "}
                  <div className="custom-proposal__script-param-type">
                    <FormField
                      name={`scriptParams.${index}.paramType`}
                      placeholder={"Param type"}
                      type="select"
                      options={paramTypeOptions}
                    />
                  </div>
                  <img
                    src={close}
                    onClick={() => removeOption(index, arrayHelpers)}
                  />
                </div>
              </div>
            ))}
          </Fragment>
        )}
      />
      <FormField
        name={formModel.formFields.discussionLink.name}
        placeholder={"Link for script implementation"}
        type="text"
      />
    </div>
  );
};

export default CustomProposal;
