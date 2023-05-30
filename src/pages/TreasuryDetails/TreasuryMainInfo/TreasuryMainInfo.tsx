import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { FC, Fragment, useEffect } from "react";
import {
  getDepositRecordsForTreasury,
  getAllMembersFromApi,
  getMemberForAptocracyFromApi,
} from "../../../api/graphql";
import {
  APTOS_COIN_ADDRESS,
  APT_DECIMALS,
  COIN_STORE_APTOS_COIN,
} from "../../../common/constants/common.constants";
import {
  IDepositRecord,
  IMemberNftInfo,
} from "../../../common/interfaces/org.interfaces";
import { provider } from "../../../program/utils";
import { treasuryStore } from "../../../state/treasuryStore";
import { calculateVotingPower } from "../../../utilities/helpers";
import "./TreasuryMainInfo.scss";
import { OrganizationType } from "../../../common/enums/org.enum";
import { getMemberRightsForTreasury } from "../../../program/methods/organization";

const TreasuryMainInfo: FC = () => {
  const {
    treasury,
    memberRights,
    treasuryBalance,
    organizationBasicInfo,
    setDepositRecords,
    setMemberRights,
    setTreasuryBalance,
  } = treasuryStore();

  const { account } = useWallet();

  useEffect(() => {
    if (treasury && organizationBasicInfo) {
      void getAdditionalTreasuryInfo();
    }
  }, [treasury, organizationBasicInfo, account?.address]);

  const getAdditionalTreasuryInfo = async () => {
    try {
      if (!treasury || !organizationBasicInfo) return;
      const depositRecords: IDepositRecord[] =
        await getDepositRecordsForTreasury(treasury.treasuryAddress);
      let allMembers = await getAllMembersFromApi(treasury.aptocracyAddress);
      if (account) {
        let memberInfo = await getMemberForAptocracyFromApi(
          treasury.aptocracyAddress,
          account.address
        );
        if (memberInfo)
          setMemberRights(
            await getMemberRightsForTreasury(
              treasury,
              memberInfo,
              depositRecords,
              organizationBasicInfo
            )
          );
      }
      const treasuryBalance: any = await provider.getAccountResource(
        treasury.treasuryAddress,
        COIN_STORE_APTOS_COIN
      );
      if (Number(treasuryBalance.data.coin.value) !== undefined) {
        setTreasuryBalance(treasuryBalance.data.coin.value);
      }
      setDepositRecords(depositRecords);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {treasury && (
        <div className="treasury-main-info">
          <div className="treasury-main-info__balance">
            <p className="treasury-main-info__balance-title">
              Treasury balance
            </p>
            {treasuryBalance && (
              <p className="treasury-main-info__balance-amount">
                {treasuryBalance / APT_DECIMALS} APT
              </p>
            )}
            <p>
              Deposited amount: {treasury.depositedAmount / APT_DECIMALS} APT
            </p>
          </div>
          {memberRights && (
            <div className="treasury-main-info__member-rights">
              <div className="treasury-main-info__member-rights-item">
                <p className="treasury-main-info__member-rights-label">
                  Your deposit
                </p>
                <p className="treasury-main-info__member-rights-value">
                  {memberRights?.depositAmount} APT
                </p>
              </div>
              {/* TODO: check if we want to have ownership concept */}
              <div className="treasury-main-info__member-rights-item">
                <p className="treasury-main-info__member-rights-label">
                  Ownership
                </p>
                <p className="treasury-main-info__member-rights-value">
                  {memberRights?.ownership}%
                </p>
              </div>
              <div className="treasury-main-info__member-rights-item">
                <p className="treasury-main-info__member-rights-label">
                  Voting power
                </p>
                <p className="treasury-main-info__member-rights-value">
                  {memberRights?.votingPower}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default TreasuryMainInfo;
