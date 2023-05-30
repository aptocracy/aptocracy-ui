import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  getTreasuryByIndex,
  getGovernanceId,
  getOrganizationBasicDataFromApi,
} from "../../api/graphql";
import {
  ITreasury,
  IGovernance,
  IOrganizationBasicData,
} from "../../common/interfaces/org.interfaces";
import { treasuryStore } from "../../state/treasuryStore";
import { checkActionForRole } from "../../utilities/helpers";
import coverImg from "../../assets/cover.svg";
import addIcon from "../../assets/add_circle.svg";
import MainButton from "../../components/MainButton/MainButton";
import "./TreasuryDetails.scss";
import { createNotification } from "../../utilities/notification";
import { MESSAGE_TYPE } from "../../common/constants/common.constants";
import DepositModal from "./DepositModal/DepositModal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import GovernanceItem from "../../components/GovernanceItem/GovernanceItem";
import TreasuryMainInfo from "./TreasuryMainInfo/TreasuryMainInfo";
import Proposals from "./Proposals/Proposals";
import { OrgActions } from "../../common/enums/org.enum";
import WithdrawModal from "./WithdrawModal/WithdrawModal";
import { AptosAccount, BCS, TxnBuilderTypes } from "aptos";

const TreasuryDetails = () => {
  const {
    treasury,
    treasuryGovernance,
    organizationBasicInfo,
    setOrganizationBasicInfo,
    setTreasury,
    setTreasuryGovernance,
    resetStore,
    memberRights,
  } = treasuryStore();
  const params = useParams();
  const [depositModalActive, toggleDepositModal] = useState(false);
  const [withdrawalModalActive, toggleWithdrawalModal] = useState(false);

  const { account } = useWallet();

  useEffect(() => {
    void getTreasuryInfo();
    return () => {
      resetStore();
    };
  }, [params.orgAddress, params.treasuryIndex, account?.address]);

  const getTreasuryInfo = async () => {
    try {
      if (params.orgAddress && params.treasuryIndex) {
        const treasury: ITreasury = await getTreasuryByIndex(
          params.orgAddress,
          Number(params.treasuryIndex)
        );

        const treasuryGovernance: IGovernance = await getGovernanceId(
          treasury.aptocracyAddress,
          treasury.governanceId
        );
        const organizationInfo: IOrganizationBasicData =
          await getOrganizationBasicDataFromApi(treasury.aptocracyAddress);
        setTreasury(treasury);
        setTreasuryGovernance(treasuryGovernance);
        setOrganizationBasicInfo(organizationInfo);
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to load treasury info");
    }
  };

  const isDepositDisabled = useMemo(() => {
    return (
      organizationBasicInfo?.inviteOnly &&
      !checkActionForRole(
        undefined,
        account?.address,
        OrgActions.SupportOrg,
        organizationBasicInfo.roleConfig,
        memberRights?.role
      )
    );
  }, [organizationBasicInfo, account?.address, memberRights]);

  const isWithdrawButtonDisabled = useMemo(() => {
    return memberRights === undefined || memberRights.depositAmount === 0;
  }, [memberRights]);

  return (
    <Fragment>
      {depositModalActive && (
        <DepositModal closeModal={() => toggleDepositModal(false)} />
      )}
      {withdrawalModalActive && (
        <WithdrawModal closeModal={() => toggleWithdrawalModal(false)} />
      )}
      <div className="treasury-details">
        {treasury && (
          <Fragment>
            <div className="treasury-details__org">
              <img
                className="treasury-details__org-img"
                src={organizationBasicInfo?.image ?? coverImg}
                alt="Organization avatar"
              />
              <p className="treasury-details__org-name">
                Organization: <span>{organizationBasicInfo?.name}</span>
              </p>
            </div>
            <div className="treasury-details__header">
              <div className="treasury-details__treasury-basic">
                <div>
                  <h3>Treasury #{treasury?.treasuryIndex}</h3>
                  <p>
                    Address: <span>{treasury?.treasuryAddress}</span>
                  </p>
                </div>
                <div className="treasury-details__actions">
                  <MainButton
                    onClick={() => {
                      toggleDepositModal(true);
                    }}
                    type="button"
                    disabled={isDepositDisabled}
                  >
                    <img
                      src={addIcon}
                      alt="Add role"
                      className="treasury-details__button-svg"
                    />
                    Deposit
                  </MainButton>
                  <MainButton
                    onClick={() => {
                      toggleWithdrawalModal(true);
                    }}
                    type="button"
                    light
                    disabled={isWithdrawButtonDisabled}
                  >
                    Withdraw
                  </MainButton>
                </div>
              </div>
              {treasuryGovernance && (
                <div className="treasury-details__rules">
                  <GovernanceItem
                    item={treasuryGovernance}
                    title={`Treasury rules - Governance #${treasuryGovernance.governanceId}`}
                    isMain={
                      treasuryGovernance.governanceId ===
                      organizationBasicInfo?.mainGovernance
                    }
                  />
                </div>
              )}
              <TreasuryMainInfo />
              <Proposals />
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default TreasuryDetails;
