import React, { FC } from "react";
import { ISelectOption } from "../../common/interfaces/org.interfaces";
import SelectButton from "../SelectButton/SelectButton";
import "./SelectFieldWithDescription.scss";

interface ISelectFieldWithDescriptionProps {
  options: ISelectOption[];
  chosenOption: ISelectOption;
  onSelect: (value: string | number) => void;
}

const SelectFieldWithDescription: FC<ISelectFieldWithDescriptionProps> = ({
  options,
  chosenOption,
  onSelect,
}) => {
  console.log(options);
  return (
    <div className="select-with-desc">
      <div className="select-with-desc__header">
        <p className="select-with-desc__title">{chosenOption.title}</p>
        <SelectButton onSelect={onSelect} options={options} />
      </div>
      <p className="select-with-desc__description">
        {chosenOption.description}
      </p>
    </div>
  );
};

export default SelectFieldWithDescription;
