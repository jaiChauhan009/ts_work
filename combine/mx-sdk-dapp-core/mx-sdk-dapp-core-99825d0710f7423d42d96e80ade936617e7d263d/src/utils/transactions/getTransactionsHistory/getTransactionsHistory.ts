import isEmpty from 'lodash/isEmpty';
import { ITransactionListItem } from 'lib/sdkDappCoreUi';
import type { IGetHistoricalTransactionsParams } from 'types/transaction-list-item.types';
import {
  createTransactionsHistoryFromSessions,
  mapServerTransactionsToListItems
} from './helpers';

export const getTransactionsHistory = async ({
  transactionsSessions,
  address,
  explorerAddress,
  rewaLabel
}: IGetHistoricalTransactionsParams): Promise<ITransactionListItem[]> => {
  if (isEmpty(transactionsSessions)) {
    return [];
  }

  const signedTransactions =
    createTransactionsHistoryFromSessions(transactionsSessions);

  return mapServerTransactionsToListItems({
    transactions: signedTransactions,
    address,
    explorerAddress,
    rewaLabel
  });
};
