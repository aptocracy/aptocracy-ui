import React, { FC, Fragment } from "react";
import "./InputField.scss";

const InputField: FC<{
  error?: string;
  type: string;
  onChange: (value: any) => void;
  disable?: boolean;
  placeholder: string;
  value: any;
}> = ({ error, type, onChange, disable, placeholder, value }) => {
  return (
    <Fragment>
      <input
        className={`${
          error ? "input-field input-field--error" : "input-field"
        }`}
        type={type}
        placeholder={placeholder}
        min="0"
        onInput={(e: any) => {
          onChange(e.target.value);
        }}
        onWheel={(event: any) => event.target.blur()}
        value={value}
        disabled={disable}
      />
      {error && <p className="input-field__error">{error}</p>}
    </Fragment>
  );
};

export default InputField;
