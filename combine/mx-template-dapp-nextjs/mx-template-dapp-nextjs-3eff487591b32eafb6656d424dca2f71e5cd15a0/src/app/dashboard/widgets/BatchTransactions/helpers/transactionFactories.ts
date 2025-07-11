import {
  Address,
  Transaction,
  TransactionsFactoryConfig,
  TransferTransactionsFactory,
  GAS_PRICE,
  VERSION
} from '@/lib';
import { TransactionProps } from '@/types';
import BigNumber from 'bignumber.js';

import { BATCH_TRANSACTIONS_SC } from '@/config';

const NUMBER_OF_TRANSACTIONS = 5;

export const getBatchTransactions = ({
  address,
  chainID
}: TransactionProps): Transaction[] => {
  const transactions = Array.from(Array(NUMBER_OF_TRANSACTIONS).keys());

  const factoryConfig = new TransactionsFactoryConfig({ chainID });
  const factory = new TransferTransactionsFactory({ config: factoryConfig });

  return transactions.map((id) => {
    const tokenTransfer = factory.createTransactionForNativeTokenTransfer(
      Address.newFromBech32(address),
      {
        receiver: Address.newFromBech32(address),
        nativeAmount: BigInt(new BigNumber(id).plus(1).shiftedBy(18).toFixed())
      }
    );

    return tokenTransfer;
  });
};

export const getSwapAndLockTransactions = ({
  address,
  chainID,
  nonce
}: TransactionProps): Transaction[] => {
  return [
    new Transaction({
      chainID,
      gasLimit: BigInt(4200000),
      gasPrice: BigInt(GAS_PRICE),
      nonce: BigInt(nonce),
      receiver: Address.newFromBech32(
        BATCH_TRANSACTIONS_SC.rewa_wREWA.contract
      ),
      sender: Address.newFromBech32(address),
      value: BigInt(new BigNumber(1).shiftedBy(18).toFixed()),
      version: VERSION,
      data: Uint8Array.from(Buffer.from(BATCH_TRANSACTIONS_SC.rewa_wREWA.data))
    }),
    new Transaction({
      chainID,
      gasLimit: BigInt(25500000),
      gasPrice: BigInt(GAS_PRICE),
      nonce: BigInt(nonce),
      receiver: Address.newFromBech32(
        BATCH_TRANSACTIONS_SC.wREWA_USDC.contract
      ),
      sender: Address.newFromBech32(address),
      value: BigInt('0'),
      version: VERSION,
      data: Uint8Array.from(Buffer.from(BATCH_TRANSACTIONS_SC.wREWA_USDC.data))
    }),
    new Transaction({
      chainID,
      gasLimit: BigInt(25500000),
      gasPrice: BigInt(GAS_PRICE),
      nonce: BigInt(nonce),
      receiver: Address.newFromBech32(BATCH_TRANSACTIONS_SC.wREWA_MOA.contract),
      sender: Address.newFromBech32(address),
      value: BigInt('0'),
      version: VERSION,
      data: Uint8Array.from(Buffer.from(BATCH_TRANSACTIONS_SC.wREWA_MOA.data))
    }),
    new Transaction({
      chainID,
      gasLimit: BigInt(10000000),
      gasPrice: BigInt(GAS_PRICE),
      nonce: BigInt(nonce),
      receiver: Address.newFromBech32(BATCH_TRANSACTIONS_SC.lock_MOA.contract),
      sender: Address.newFromBech32(address),
      value: BigInt('0'),
      version: VERSION,
      data: Uint8Array.from(Buffer.from(BATCH_TRANSACTIONS_SC.lock_MOA.data))
    })
  ];
};
