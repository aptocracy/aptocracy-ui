import React, { FC } from "react";
import { useNavigate } from "react-router";
import coverImg from "../../assets/cover.svg";
import { ORG_DETAILS } from "../../common/constants/routes.constants";
import "./OrgCard.scss";

const OrgCard: FC<{ name: string; address: string; orgImg?: string }> = ({
  name,
  orgImg,
  address,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="org-card"
      onClick={() => navigate(`${ORG_DETAILS}/${address}`)}
    >
      <img
        src={orgImg ?? coverImg}
        alt="Organization cover"
        className="org-card__image"
      />
      <h3>{name}</h3>
    </div>
  );
};

export default OrgCard;
