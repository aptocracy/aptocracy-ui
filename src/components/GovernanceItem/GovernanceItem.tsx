import React, { FC } from "react";
import { IGovernance } from "../../common/interfaces/org.interfaces";
import Chip from "../Chip/Chip";
import "./GovernanceItem.scss";
import { getLocalDateFormat } from "../../utilities/helpers";

const GovernanceItem: FC<{
  item: IGovernance;
  title: string;
  isMain: boolean;
}> = ({ item, title, isMain }) => {
  return (
    <div className="governance-item">
      <div className="governance-item__title">
        <p>{title}</p>
        {item.earlyTipping && (
          <Chip
            backgroundColor="#c3f5e8"
            text="Early tipping"
            fontSize={0.75}
          />
        )}
        {isMain && <Chip text="Main governance" fontSize={0.75} />}
      </div>
      <div className="governance-item__info">
        <div>
          <p className="governance-item__info-label">Approval quorum</p>
          <p>{item.approvalQuorum}%</p>
        </div>
        <div>
          <p className="governance-item__info-label">Quorum</p>
          <p>{item.quorum}%</p>
        </div>
        <div>
          <p className="governance-item__info-label">Max voting time</p>
          <p>{item.maxVotingTime / 24 / 60 / 60} days</p>
        </div>
        <div>
          <p className="governance-item__info-label">Valid from</p>
          <p>{getLocalDateFormat(item.validFrom)} </p>
        </div>
      </div>
    </div>
  );
};

export default GovernanceItem;
