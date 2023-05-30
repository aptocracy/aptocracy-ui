import React, { FC, useState } from "react";
import InputField from "../../../components/InputField/InputField";
import MainButton from "../../../components/MainButton/MainButton";
import Modal from "../../../components/Modal/Modal";
import addIcon from "../../../assets/add_circle.svg";
import "./DepositModal.scss";
import { treasuryStore } from "../../../state/treasuryStore";
import { createNotification } from "../../../utilities/notification";
import { MESSAGE_TYPE } from "../../../common/constants/common.constants";
import { depositFunds } from "../../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  getDepositRecordsForTreasury,
  getTreasuryByIndex,
} from "../../../api/graphql";
import { checkActionForRole } from "../../../utilities/helpers";
import { OrgActions } from "../../../common/enums/org.enum";

const DepositModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [depositAmount, setDepositAmount] = useState<number>();
  const {
    depositRecords,
    setDepositRecords,
    treasury,
    setTreasury,
    organizationBasicInfo,
    memberRights,
  } = treasuryStore();
  const { signAndSubmitTransaction, account } = useWallet();

  const depositFundsHandler = async () => {
    try {
      if (!treasury) {
        throw new Error("Treasury not loaded");
      }
      if (depositAmount) {
        await depositFunds(
          treasury?.aptocracyAddress,
          treasury?.treasuryAddress,
          depositAmount,
          signAndSubmitTransaction
        );
        setTreasury(
          await getTreasuryByIndex(
            treasury.aptocracyAddress,
            treasury.treasuryIndex
          )
        );
        createNotification(
          MESSAGE_TYPE.SUCCESS,
          "Funds successfully deposited!"
        );
        closeModal();
      }
    } catch (error) {
      console.log(error);
      createNotification(
        MESSAGE_TYPE.ERROR,
        "Failed to deposit funds to treasury"
      );
    }
  };

  return (
    <Modal closeModal={closeModal} title="Deposit funds to treasury">
      <div className="deposit-modal">
        <InputField
          onChange={(value) => {
            setDepositAmount(value);
          }}
          placeholder="Deposit amount"
          type="number"
          value={depositAmount}
        />
        <MainButton onClick={depositFundsHandler} type="button" light>
          <img src={addIcon} alt="Add role" />
          Deposit
        </MainButton>
      </div>
    </Modal>
  );
};

export default DepositModal;
