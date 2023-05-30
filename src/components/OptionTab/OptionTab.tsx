import React, { FC } from "react";
import "./OptionTab.scss";

interface IOptionTabProps {
  firstOption: string;
  secondOption: string;
  activeOption: string;
  onChange: (option: string) => void;
}

const OptionTab: FC<IOptionTabProps> = ({
  firstOption,
  onChange,
  secondOption,
  activeOption,
}) => {
  return (
    <div className="option-tab">
      <button
        type="button"
        className={`option-tab__button ${
          activeOption === firstOption && " option-tab__button--active"
        }`}
        onClick={() => onChange(firstOption)}
      >
        {firstOption}
      </button>
      <button
        type="button"
        className={`option-tab__button ${
          activeOption === secondOption && " option-tab__button--active"
        }`}
        onClick={() => {
          onChange(secondOption);
        }}
      >
        {secondOption}
      </button>
    </div>
  );
};

export default OptionTab;
