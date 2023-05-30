import React, { FC, Fragment } from "react";
import { organizationStore } from "../../../state/organizationStore";
import { EMPTY_STRING } from "../../../common/constants/common.constants";
import { OrganizationType } from "../../../common/enums/org.enum";
import {
  copyItemToClipboard,
  getTrimmedPublicKey,
  getOrgTypeText,
} from "../../../utilities/helpers";
import Chip from "../../../components/Chip/Chip";
import coverImg from "../../../assets/cover.svg";
import "./AboutOrg.scss";

const AboutOrg: FC = () => {
  const { organizationBasicInfo } = organizationStore();
  return (
    <Fragment>
      {organizationBasicInfo && (
        <div className="about-org">
          <img
            src={organizationBasicInfo.image ?? coverImg}
            alt="Org cover"
            className="about-org__image"
          />
          <h3 className="about-org__name">{organizationBasicInfo.name}</h3>
          <p className="about-org__creator">
            {organizationBasicInfo.description}
          </p>
          <p className="about-org__creator">
            Created by:{" "}
            <span
              onClick={() =>
                copyItemToClipboard(
                  organizationBasicInfo.creator,
                  "Address copied"
                )
              }
            >
              {getTrimmedPublicKey(organizationBasicInfo.creator)}
            </span>
          </p>
          <div className="about-org__chips">
            <Chip
              text={
                organizationBasicInfo.inviteOnly
                  ? "Invite only"
                  : "Open for new members"
              }
            />
            <Chip
              text={getOrgTypeText(Number(organizationBasicInfo.orgType))}
            />
            {Number(organizationBasicInfo.orgType) ===
              OrganizationType.NftBased && (
              <Chip
                text={`Collection: ${organizationBasicInfo?.governingCollectionInfo.name}`}
              />
            )}
          </div>
          {Number(organizationBasicInfo.orgType) ===
            OrganizationType.NftBased && (
            <p className="about-org__collection-address">
              Collection address:{" "}
              <span
                onClick={() =>
                  organizationBasicInfo.governingCollectionInfo?.creator &&
                  copyItemToClipboard(
                    organizationBasicInfo.governingCollectionInfo?.creator,
                    "Address copied"
                  )
                }
              >
                {getTrimmedPublicKey(
                  organizationBasicInfo.governingCollectionInfo?.creator ??
                    EMPTY_STRING
                )}
              </span>
            </p>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default AboutOrg;
