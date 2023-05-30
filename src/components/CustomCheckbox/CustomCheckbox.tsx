import React, { FC } from "react";

import "./CustomCheckbox.scss";

interface CustomCheckboxProps {
  checked: boolean;
  onClickMethod: (argument?: any) => void;
  transparent?: boolean;
  disabled?: boolean;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({
  onClickMethod,
  checked,
  transparent = false,
  disabled,
}) => {
  return (
    <div
      className={`custom-checkbox ${disabled && "custom-checkbox--disabled"}`}
      onClick={() => {
        !disabled && onClickMethod();
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          !disabled && onClickMethod();
        }}
      />
      <span
        className={`${
          transparent
            ? "custom-checkbox__checkmark-transparent"
            : "custom-checkbox__checkmark"
        }`}
      ></span>
    </div>
  );
};

export default CustomCheckbox;
