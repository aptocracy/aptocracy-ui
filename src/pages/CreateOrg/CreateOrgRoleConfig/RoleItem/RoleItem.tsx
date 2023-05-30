import React, { FC, useEffect, useMemo, useState } from "react";
import {
  OrgActions,
  OrganizationType,
} from "../../../../common/enums/org.enum";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";
import "./RoleItem.scss";
import {
  ICreateOrgFields,
  IOption,
} from "../../../../common/interfaces/org.interfaces";
import FormField from "../../../../components/FormField/FormField";
import { EMPTY_STRING } from "../../../../common/constants/common.constants";
import close from "../../../../assets/close.svg";
import { FieldArrayRenderProps, useFormikContext } from "formik";
import { formModel } from "../../formConfig";

export const styles: StylesConfig<IOption, true> = {
  option: () => ({
    cursor: "pointer",
    padding: "1em 2em",
    fontSize: "0.8em",
    fontFamily: "Montserrat,sans-serif",
    fontWeight: 100,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    margin: 0,
    zIndex: 50,
    width: "100%",
    color: "black",
    "&:hover": {
      opacity: 0.7,
      cursor: "pointer",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "transparent",

    borderRadius: "8px",
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "0.9em",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0.9em",
    fontWeight: "100",
    fontFamily: "Montserrat, sans-serif",
    marginLeft: "1em",
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: "10px",
    fontSize: "0.75em",
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid #a2deed",
    color: "white",
    fontFamily: "Montserrat",
    boxShadow: "none",
    padding: "0.5em",
    width: "100%",
  }),
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "#a5a5a5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
};

const orderOptions = (values: readonly IOption[]) => {
  return values
    .filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

interface IRoleItemConfig {
  title?: string;
  isDefault?: boolean;
  voteWeight?: boolean;
  options: IOption[];
  index: number;
  removeOption: () => void;
  isPredefined: boolean;
}

const RoleItem: FC<IRoleItemConfig> = ({
  isDefault,
  title,
  options,
  index,
  removeOption,
  isPredefined,
}) => {
  const { values, setFieldValue } = useFormikContext<ICreateOrgFields>();
  const [actions, setActions] = useState<readonly IOption[]>(
    options.filter(
      (item) =>
        values.roleConfig[index].roleActions.find(
          (action) => item.value === action
        ) !== undefined
    )
  );

  useEffect(() => {
    setActions(
      orderOptions(
        options.filter(
          (item) =>
            values.roleConfig[index].roleActions.find(
              (action) => item.value === action
            ) !== undefined
        )
      )
    );
  }, [values.roleConfig[index].roleActions]);

  const onChange = (
    newValue: OnChangeValue<IOption, true>,
    actionMeta: ActionMeta<IOption>
  ) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = actions.filter((v) => v.isFixed);
        break;
    }

    setActions(newValue);
    setFieldValue(
      `roleConfig.${index}.roleActions`,
      newValue.map((item) => item.value)
    );
  };

  return (
    <div className="role-item">
      <div className="role-item__basic-info">
        {isPredefined ? (
          <p className="role-item__title">
            {title} {isDefault ? <span>default</span> : EMPTY_STRING}
          </p>
        ) : (
          <FormField
            name={`roleConfig.${index}.roleName`}
            placeholder={EMPTY_STRING}
            type="text"
            label="Role name"
          />
        )}
        {!isPredefined && <img src={close} onClick={removeOption} />}
      </div>
      {values.orgType === OrganizationType.RoleBased && (
        <FormField
          name={`roleConfig.${index}.roleWeight`}
          placeholder={EMPTY_STRING}
          type="number"
          label="Role weight"
        />
      )}
      <div className="role-item__actions">
        <p>Select organization actions: </p>
        <Select
          value={actions}
          isMulti
          styles={styles}
          isClearable={actions.some((v) => !v.isFixed)}
          name="colors"
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={onChange}
          options={options}
        />
      </div>
    </div>
  );
};

export default RoleItem;
