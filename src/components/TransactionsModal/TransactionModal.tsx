import React, { useCallback, useEffect } from "react";
import { TransactionState } from "../../common/enums/org.enum";
import useTransactionStore from "../../state/transactionStore";
import Modal from "../Modal/Modal";
import TransactionItem from "./TransactionItem/TransactionItem";

const TransactionModal = () => {
  const { transactions, isProcessing, closeTransactionProcess } =
    useTransactionStore();

  const closeModalIfNeeded = useCallback(() => {
    if (
      !transactions.find(
        (item) => item.transactionState === TransactionState.Loading
      )
    ) {
      closeTransactionProcess();
    }
  }, [transactions, closeTransactionProcess]);

  useEffect(() => {
    void closeIfAllTransactionPassed();
  }, [transactions]);

  const closeIfAllTransactionPassed = async () => {
    if (
      transactions.filter(
        (item) => item.transactionState === TransactionState.Succeeded
      ).length === transactions.length
    ) {
      closeTransactionProcess();
    }
  };

  return (
    <>
      {isProcessing && (
        <Modal closeModal={closeModalIfNeeded} title={"Transaction list"}>
          <div className="bulk-modal__transactions">
            {transactions.map((item) => (
              <TransactionItem networkItem={item} key={item.number} />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default TransactionModal;
