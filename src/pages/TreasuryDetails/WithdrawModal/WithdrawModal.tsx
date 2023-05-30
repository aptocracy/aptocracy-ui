import React, { FC, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import InputField from "../../../components/InputField/InputField";
import MainButton from "../../../components/MainButton/MainButton";
import { treasuryStore } from "../../../state/treasuryStore";
import { createNotification } from "../../../utilities/notification";
import { MESSAGE_TYPE } from "../../../common/constants/common.constants";
import { withdrawFunds } from "../../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getTreasuryByIndex } from "../../../api/graphql";

const WithdrawModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [withdrawAmount, setWithdrawAmount] = useState();
  const { memberRights, treasury, setTreasury } = treasuryStore();
  const { signAndSubmitTransaction } = useWallet();
  const withdrawFundsHandler = async () => {
    try {
      if (treasury && memberRights && withdrawAmount !== undefined) {
        await withdrawFunds(
          treasury.aptocracyAddress,
          treasury.treasuryAddress,
          withdrawAmount,
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
          "Funds successfully withdrawed!"
        );
        closeModal();
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to withdraw funds");
    }
  };

  return (
    <Modal closeModal={closeModal} title="Withdraw deposited funds">
      <div className="deposit-modal">
        <InputField
          onChange={(value) => {
            setWithdrawAmount(value);
          }}
          placeholder="Withdraw amount"
          type="number"
          value={withdrawAmount}
        />
        <MainButton onClick={withdrawFundsHandler} type="button" light>
          Withdraw
        </MainButton>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
