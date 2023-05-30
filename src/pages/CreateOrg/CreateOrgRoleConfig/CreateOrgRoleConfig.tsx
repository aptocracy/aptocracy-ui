import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik";
import React, { Fragment, useCallback } from "react";
import {
  CUSTOM_ORGANIZATION_ACTION_OPTIONS,
  EMPTY_STRING,
  MEMBER_ORGANIZATION_ACTION_OPTIONS,
  OWNER_ORGANIZATION_ACTION_OPTIONS,
} from "../../../common/constants/common.constants";
import { ICreateOrgFields } from "../../../common/interfaces/org.interfaces";
import FieldWithDescription from "../../../components/FieldWithDescription/FieldWithDescription";
import { formModel } from "../formConfig";
import RoleItem from "./RoleItem/RoleItem";
import addRoleIcon from "../../../assets/add_circle.svg";
import "./CreateOrgRoleConfig.scss";
import MainButton from "../../../components/MainButton/MainButton";

const CreateOrgRoleConfig = () => {
  const { values, setFieldValue } = useFormikContext<ICreateOrgFields>();
  console.log(values);
  const addNewRole = (arrayHelpers: FieldArrayRenderProps) => {
    arrayHelpers.push({
      roleName: EMPTY_STRING,
      roleWeight: EMPTY_STRING,
      roleActions: [],
      isPredefined: false,
    });
  };

  const getOptions = useCallback((roleName: string) => {
    switch (roleName) {
      case "Member":
        return MEMBER_ORGANIZATION_ACTION_OPTIONS;
      case "Owner":
        return OWNER_ORGANIZATION_ACTION_OPTIONS;
      default:
        return CUSTOM_ORGANIZATION_ACTION_OPTIONS;
    }
  }, []);

  const removeOption = useCallback(
    (index: number, arrayHelpers: FieldArrayRenderProps) => {
      arrayHelpers.remove(index);
    },
    []
  );

  return (
    <div className="create-role-config">
      <p>Define role configuration for organization</p>
      <FieldArray
        name={formModel.formFields.roleConfig.name}
        render={(arrayHelpers) => (
          <Fragment>
            {values.roleConfig.map((item, index) => (
              <RoleItem
                isDefault={item.roleName === "Member"}
                title={item.roleName}
                isPredefined={item.isPredefined}
                options={getOptions(item.roleName)}
                index={index}
                removeOption={() => removeOption(index, arrayHelpers)}
              />
            ))}
            <div className="create-role-config__actions">
              <MainButton
                onClick={() => addNewRole(arrayHelpers)}
                type="button"
                light
              >
                <img src={addRoleIcon} alt="Add role" />
                Add new role
              </MainButton>
            </div>
          </Fragment>
        )}
      />
      {/* <RoleItem title={"Owner"} options={OWNER_ORGANIZATION_ACTION_OPTIONS} /> */}
    </div>
  );
};

export default CreateOrgRoleConfig;
