import React, { useEffect } from "react";
import { useParams } from "react-router";
import { getAllMembersFromApi } from "../../../api/graphql";
import { organizationStore } from "../../../state/organizationStore";
import memberCover from "../../../assets/memberCover.svg";
import "./Members.scss";
import {
  copyItemToClipboard,
  getMemberStatusLabel,
  getTrimmedPublicKey,
} from "../../../utilities/helpers";

const Members = () => {
  const { members, setMembersInfo } = organizationStore();
  const params = useParams();

  useEffect(() => {
    void getAllMembers();
  }, [params.orgAddress]);

  const getAllMembers = async () => {
    try {
      if (!params.orgAddress) {
        return;
      }
      setMembersInfo(await getAllMembersFromApi(params.orgAddress));
    } catch (error) {}
  };

  return (
    <div className="members">
      {members?.map((item) => (
        <div className="members__member-item">
          <div className="members__member-item-main">
            <img src={memberCover} alt="Member cover" />
            <p
              className="members__member-item-address"
              onClick={() =>
                copyItemToClipboard(item.memberAddress, "Address copied")
              }
            >
              {getTrimmedPublicKey(item.memberAddress)}
            </p>
          </div>
          <div className="members__info">
            <div className="members__info-item">
              <p className="members__info-label">Role</p>
              <p className="members__info-value">{item.role}</p>
            </div>
            <div className="members__info-item">
              <p className="members__info-label">Status</p>
              <p className="members__info-value">
                {getMemberStatusLabel(item.status)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
