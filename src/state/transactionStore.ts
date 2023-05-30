import create from "zustand";
import { ITransactionInfo } from "../common/interfaces/org.interfaces";

interface ITransactionStore {
  isProcessing: boolean;
  transactions: ITransactionInfo[];
  addTransactions: (transaction: ITransactionInfo[]) => void;
  processedTransactions: ITransactionInfo[];
  retryCallback: (() => Promise<void>) | null;
  updateCurrentTransaction: (
    transaction: ITransactionInfo,
    retryCallback?: () => Promise<void>
  ) => void;
  closeTransactionProcess: () => void;
  startProcessing: (transactions: ITransactionInfo[]) => void;
  updateProcessedTransactions: (transaction: ITransactionInfo) => void;
}

const defaultState = {
  isProcessing: false,
  transactions: [],
  processedTransactions: [],
  retryCallback: null,
};

const useTransactionStore = create<ITransactionStore>((set, get) => ({
  ...defaultState,
  startProcessing: (transactions: ITransactionInfo[]) => {
    set({
      isProcessing: true,
      transactions: transactions,
    });
  },
  closeTransactionProcess: () => {
    set({
      ...defaultState,
    });
  },
  updateCurrentTransaction: (
    transaction: ITransactionInfo,
    retryCallback?: () => Promise<void>
  ) => {
    const transactions = [...get().transactions];
    console.log(transactions, "TXS");
    const txIndex = transactions.findIndex(
      (item) => item.number === transaction.number
    );
    transactions[txIndex] = {
      number: transactions[txIndex].number,
      transactionState: transaction.transactionState,
      txid: transaction.txid,
      description: transaction.description,
      payload: transaction.payload,
    };

    set({
      transactions: transactions,
      retryCallback: retryCallback ?? null,
    });
  },
  updateProcessedTransactions: (transaction: ITransactionInfo) => {
    const processedTx = get().processedTransactions;
    set({
      processedTransactions: [...processedTx, transaction],
    });
  },
  addTransactions: (transactions: ITransactionInfo[]) =>
    set(() => ({ transactions: [...get().transactions, ...transactions] })),
}));

export default useTransactionStore;
