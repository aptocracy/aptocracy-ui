import { Types } from "aptos";
import { TransactionState } from "../common/enums/org.enum";
import { ITransactionInfo } from "../common/interfaces/org.interfaces";
import useTransactionStore from "../state/transactionStore";
import { provider } from "./utils";

export const sendTransactions = async (
  initialTransactions: ITransactionInfo[],
  senderAddress: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>,
  callbackTransactionNumber?: number,
  successAction?: () => void
) => {
  const {
    startProcessing,
    updateCurrentTransaction,
    updateProcessedTransactions,
    transactions,
  } = useTransactionStore.getState();

  let transactionsForStore: ITransactionInfo[] = [];
  if (callbackTransactionNumber === undefined) {
    transactionsForStore = initialTransactions;
  } else {
    transactionsForStore = transactions;
    for (let i = callbackTransactionNumber; i < transactions.length; i++) {
      updateCurrentTransaction({
        number: i + 1,
        transactionState: TransactionState.Pending,
        description: transactions[i].description,
        payload: transactions[i].payload,
      });
    }
  }

  callbackTransactionNumber === undefined &&
    startProcessing(transactionsForStore);
  let sendTxCounter = callbackTransactionNumber ?? 0;

  for (let i = sendTxCounter; i < transactionsForStore.length; i++) {
    try {
      const processedTx: ITransactionInfo = {
        number: i + 1,
        transactionState: TransactionState.Loading,
        description: transactionsForStore[i].description,
        payload: transactionsForStore[i].payload,
      };
      updateCurrentTransaction(processedTx);

      updateProcessedTransactions(processedTx);

      const response = await signAndSubmitTransaction(
        transactionsForStore[i].payload
      );
      const transactionResult = await provider.waitForTransactionWithResult(
        response.hash
      );
      const successfullTx = {
        number: i + 1,
        transactionState: TransactionState.Succeeded,
        txid: transactionResult.hash,
        description: transactionsForStore[i].description,
        payload: transactionsForStore[i].payload,
      };
      updateCurrentTransaction(successfullTx);
    } catch (error) {
      console.log(error);
      const failedTransactions = transactionsForStore.slice(
        i,
        transactionsForStore.length
      );

      updateCurrentTransaction(
        {
          number: i + 1,
          transactionState: TransactionState.Failed,
          description: transactionsForStore[i].description,
          payload: transactionsForStore[i].payload,
        },
        async () => {
          try {
            await sendTransactions(
              failedTransactions,
              senderAddress,
              signAndSubmitTransaction,
              i,
              successAction
            );
          } catch (error) {
            console.log(error);
          }
        }
      );
      throw error;
    }
  }

  successAction && successAction();
};
