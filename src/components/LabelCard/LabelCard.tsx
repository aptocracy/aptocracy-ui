import React, { FC } from "react";
import "./LabelCard.scss";

interface ILabelCardProps {
  label: string;
  description: string;
}

const LabelCard: FC<ILabelCardProps> = ({ label, description }) => {
  return (
    <div className="label-card">
      <p className="label-card__label">{label}</p>
      <p className="label-card__description">{description}</p>
    </div>
  );
};

export default LabelCard;
