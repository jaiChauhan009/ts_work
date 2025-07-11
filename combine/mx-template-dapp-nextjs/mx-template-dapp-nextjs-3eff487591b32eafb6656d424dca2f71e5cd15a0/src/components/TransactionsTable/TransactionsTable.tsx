'use client';
import { useEffect, useState } from 'react';
import {
  ITransactionsTableRow,
  MvxTransactionsTable,
  ServerTransactionType,
  TransactionsTableController,
  useGetAccount,
  useGetNetworkConfig
} from '@/lib';

interface TransactionsTablePropsType {
  transactions?: ServerTransactionType[];
}

export const TransactionsTable = ({
  transactions = []
}: TransactionsTablePropsType) => {
  const { address } = useGetAccount();
  const { network } = useGetNetworkConfig();
  const [processedTransactions, setProcessedTransactions] = useState<
    ITransactionsTableRow[]
  >([]);

  useEffect(() => {
    processTransactions();
  }, []);

  const processTransactions = async () => {
    const transactionsData =
      await TransactionsTableController.processTransactions({
        address,
        rewaLabel: network.rewaLabel,
        explorerAddress: network.explorerAddress,
        transactions
      });

    setProcessedTransactions(
      transactionsData as unknown as ITransactionsTableRow[]
    );
  };

  return <MvxTransactionsTable transactions={processedTransactions} />;
};
