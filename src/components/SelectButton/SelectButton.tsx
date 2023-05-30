import React, { FC, Fragment, useState } from "react";
import { EMPTY_STRING } from "../../common/constants/common.constants";
import selectArrow from "../../assets/select_arrow.svg";
import "./SelectButton.scss";
import { ISelectOption } from "../../common/interfaces/org.interfaces";

interface ISelectButtonProps {
  options: ISelectOption[];
  onSelect: (value: string | number) => void;
  buttonTitle?: string;
}

const SelectButton: FC<ISelectButtonProps> = ({
  onSelect,
  options,
  buttonTitle,
}) => {
  const [selectVisible, toggleSelect] = useState(false);

  return (
    <Fragment>
      <div className="select-button">
        <button
          style={{
            borderRadius: buttonTitle ? "0.5em" : "50%",
            width: buttonTitle ? "auto" : "32px",
          }}
          onClick={() => toggleSelect(!selectVisible)}
          type="button"
        >
          {buttonTitle ?? EMPTY_STRING}
          <img src={selectArrow} alt="Select arrow" />
        </button>
        {selectVisible && (
          <Fragment>
            <div className="select-button__option-list">
              {options?.map((item) => (
                <p
                  className="select-button__option-item"
                  onClick={() => {
                    toggleSelect(false);
                    onSelect(item.value);
                  }}
                >
                  {item.title}
                </p>
              ))}
            </div>
            <div
              className="select-button__backdrop"
              onClick={() => toggleSelect(false)}
            ></div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default SelectButton;
