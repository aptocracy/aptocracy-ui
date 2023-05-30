import React, { FC, useState } from "react";
import arrowIcon from "../../assets/arrow_down.svg";
import "./FieldWithDescription.scss";

interface IFieldWithDescriptionProps {
  title: string;
  description?: string;
  isChosen?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
}

const FieldWithDescription: FC<IFieldWithDescriptionProps> = ({
  title,
  description,
  isChosen,
  onClick,
  children,
  backgroundColor,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`field-with-description && ${
        isChosen && "field-with-description--chosen"
      }`}
      style={
        backgroundColor ? { backgroundColor: `${backgroundColor}` } : undefined
      }
      onClick={onClick}
    >
      <div className="field-with-description__header">
        <p className="field-with-description__title">{title}</p>
        <img src={arrowIcon} onClick={() => setExpanded(!expanded)} />
      </div>
      {expanded && description && (
        <p className="field-with-description__description">{description}</p>
      )}
      {expanded && children}
    </div>
  );
};

export default FieldWithDescription;
