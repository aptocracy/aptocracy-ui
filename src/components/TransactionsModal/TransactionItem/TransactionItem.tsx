import "./TransactionItem.scss";

import { FC, useMemo } from "react";
import { Oval } from "react-loader-spinner";

import { ReactComponent as LinkIcon } from "../../../assets/link2.svg";
import retryIcon from "../../../assets/retryTx.svg";
import failIcon from "../../../assets/transactionFailed.svg";
import successIcon from "../../../assets/transactionSucceeded.svg";
import { TransactionState } from "../../../common/enums/org.enum";
import { ITransactionInfo } from "../../../common/interfaces/org.interfaces";
import useTransactionStore from "../../../state/transactionStore";

const TransactionItem: FC<{ networkItem: ITransactionInfo }> = ({
  networkItem,
}) => {
  const { retryCallback } = useTransactionStore();

  const renderTransactionState = useMemo(() => {
    return (transaction: ITransactionInfo) => {
      switch (transaction.transactionState) {
        case TransactionState.Pending:
        case TransactionState.Loading:
          return <p>{transaction.number}</p>;
        case TransactionState.Succeeded:
          return <img src={successIcon} alt="Success" />;
        case TransactionState.Failed:
          return <img src={failIcon} alt="Failure" />;
      }
    };
  }, []);

  const showLinkIcon = useMemo(() => {
    return (item: ITransactionInfo) => {
      return (
        item.transactionState === TransactionState.Failed ||
        item.transactionState === TransactionState.Succeeded
      );
    };
  }, []);

  return (
    <div className="transactions-item" key={networkItem.number}>
      <div className="transactions-item__text-icon">
        <div className="transactions-item__state-text">
          {networkItem.transactionState === TransactionState.Loading ? (
            <div className="transactions-item__spinner">
              <Oval
                color="#a2deed"
                height={26}
                width={26}
                strokeWidth={5}
                secondaryColor="#b6b9be"
              />
              <p className="transactions-item__spinner-label">
                {networkItem.number}
              </p>
            </div>
          ) : (
            <div
              className={`transactions-item__state transactions-item__state--${networkItem.transactionState}`}
            >
              {renderTransactionState(networkItem)}
            </div>
          )}
          <p className="transactions-item__label">
            {networkItem.description} -{" "}
            <span
              className={`${
                networkItem.transactionState === TransactionState.Succeeded &&
                "transactions-item__success"
              }`}
            >
              {TransactionState[networkItem.transactionState]}{" "}
            </span>
          </p>
        </div>
      </div>
      {networkItem.transactionState === TransactionState.Failed &&
        retryCallback && (
          <img
            className="transactions-item__retry"
            onClick={retryCallback}
            src={retryIcon}
            alt="Retry transaction icon"
          />
        )}
    </div>
  );
};

export default TransactionItem;
