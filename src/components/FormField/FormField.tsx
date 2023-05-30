import { styled, Switch } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React, { FC } from "react";
import {
  ICreateOrgFields,
  IOption,
  ISelectOption,
} from "../../common/interfaces/org.interfaces";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import "./FormField.scss";
import { styles } from "../../pages/CreateOrg/CreateOrgRoleConfig/RoleItem/RoleItem";
import { EMPTY_STRING } from "../../common/constants/common.constants";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-track": {
    backgroundColor: "#a2deed",
    borderRadius: 26 / 2,
  },
  "&.Mui-focusVisible .MuiSwitch-thumb": {
    color: "#33cf4d",
    border: "6px solid #fff",
  },
  "& .MuiSwitch-switchBase": {
    margin: 2,
    padding: 0,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#a2deed",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
}));

interface IFormFieldProps {
  name: string;
  type: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
  inputError?: boolean;
  options?: IOption[];
}

const FormField: FC<IFormFieldProps> = (props) => {
  const { errors, values, setFieldValue } =
    useFormikContext<ICreateOrgFields>();
  const [field, meta] = useField(props.name);

  if (props.type === "switch") {
    return (
      <div className="form-field__switch">
        <p>{props.label}</p>
        <MaterialUISwitch {...field} checked={field.value} />
      </div>
    );
  }

  if (props.type === "select") {
    return (
      <Select
        options={props.options}
        styles={styles}
        onChange={(e: any) => {
          setFieldValue(field.name, e.value);
          props.onChange && props.onChange(e);
        }}
        placeholder={props.placeholder}
        isSearchable={false}
        value={
          props.options
            ? props.options.find((option) => option.value === field.value)
            : undefined
        }
      />
    );
  }

  if (props.type === "creatable-select") {
    return (
      <CreatableSelect
        isMulti
        options={props.options}
        placeholder={props.placeholder}
        styles={styles}
        onChange={(e: any) => {
          console.log(e);
          setFieldValue(
            field.name,
            e.map((item: any) => item.value)
          );
        }}
      />
    );
  }

  return (
    <div className="form-field">
      {props.label && (
        <p className="form-field__label">
          {props.label} {props.required && <span>*</span>}
        </p>
      )}
      <input
        className={`${
          meta.error && meta.touched
            ? "form-field__input form-field--error"
            : "form-field__input"
        }`}
        {...field}
        type={props.type}
        placeholder={props.placeholder}
        min="0"
        onInput={props.onChange}
        disabled={props.disabled}
        onWheel={(event: any) => event.target.blur()}
      />
      {errors[field.name as keyof typeof values] && errors && meta.touched && (
        <p className="form-field__error">
          {errors[field.name as keyof typeof values] as string}
        </p>
      )}
    </div>
  );
};

export default FormField;
