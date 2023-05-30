import React, { FC } from "react";
import { OrganizationType } from "../../../common/enums/org.enum";
import Chip from "../../../components/Chip/Chip";
import { organizationStore } from "../../../state/organizationStore";
import "./Roles.scss";
import { getActionTitle } from "../../../utilities/helpers";

const Roles: FC = () => {
  const { organizationBasicInfo } = organizationStore();

  return (
    <div className="roles">
      {organizationBasicInfo?.roleConfig.map((item) => (
        <div className="roles__item">
          <p className="roles__role-name">{item.name}</p>
          {organizationBasicInfo?.orgType === OrganizationType.RoleBased && (
            <p className="roles__actions-title">
              Role Weight: <span>{item.roleWeight}</span>
            </p>
          )}
          <p className="roles__actions-title">Available actions: </p>
          <div className="roles__actions">
            {item.actions.map((item) => (
              <Chip text={getActionTitle(item)} fontSize={0.7} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roles;
