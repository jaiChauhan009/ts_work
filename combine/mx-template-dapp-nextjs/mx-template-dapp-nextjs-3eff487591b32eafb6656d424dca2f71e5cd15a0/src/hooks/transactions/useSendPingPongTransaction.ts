'use client';
import {
  useGetAccount,
  useGetNetworkConfig,
  AbiRegistry,
  Address,
  SmartContractTransactionsFactory,
  Transaction,
  TransactionsFactoryConfig
} from '@/lib';

import { GAS_PRICE } from '@/localConstants';
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions';
import { contractAddress } from '@/config';
import pingPongAbi from '@/contracts/ping-pong.abi.json';

const PING_TRANSACTION_INFO = {
  processingMessage: 'Processing Ping transaction',
  errorMessage: 'An error has occured during Ping',
  successMessage: 'Ping transaction successful'
};

const PONG_TRANSACTION_INFO = {
  processingMessage: 'Processing Pong transaction',
  errorMessage: 'An error has occured during Pong',
  successMessage: 'Pong transaction successful'
};

export const useSendPingPongTransaction = () => {
  const { network } = useGetNetworkConfig();
  const { address } = useGetAccount();

  const getSmartContractFactory = async () => {
    const abi = AbiRegistry.create(pingPongAbi);
    const scFactory = new SmartContractTransactionsFactory({
      config: new TransactionsFactoryConfig({
        chainID: network.chainId
      }),
      abi
    });

    return scFactory;
  };

  const sendPingTransaction = async (amount: string) => {
    const pingTransaction = new Transaction({
      value: BigInt(amount),
      data: Uint8Array.from(Buffer.from('ping')),
      receiver: new Address(contractAddress),
      gasLimit: BigInt(60000000),
      gasPrice: BigInt(GAS_PRICE),
      chainID: network.chainId,
      sender: new Address(address),
      version: 1
    });

    await signAndSendTransactions({
      transactions: [pingTransaction],
      transactionsDisplayInfo: PING_TRANSACTION_INFO
    });
  };

  const sendPingTransactionFromAbi = async (amount: string) => {
    const scFactory = await getSmartContractFactory();
    const pingTransaction = scFactory.createTransactionForExecute(
      new Address(address),
      {
        gasLimit: BigInt(60000000),
        function: 'ping',
        contract: new Address(contractAddress),
        nativeTransferAmount: BigInt(amount)
      }
    );

    const sessionId = await signAndSendTransactions({
      transactions: [pingTransaction],
      transactionsDisplayInfo: PING_TRANSACTION_INFO
    });

    return sessionId;
  };

  const sendPingTransactionFromService = async (
    transactions: Transaction[]
  ) => {
    await signAndSendTransactions({
      transactions,
      transactionsDisplayInfo: PING_TRANSACTION_INFO
    });
  };

  const sendPongTransaction = async () => {
    const pongTransaction = new Transaction({
      value: BigInt(0),
      data: Uint8Array.from(Buffer.from('pong')),
      receiver: new Address(contractAddress),
      gasLimit: BigInt(60000000),
      gasPrice: BigInt(GAS_PRICE),
      chainID: network.chainId,
      sender: new Address(address),
      version: 1
    });

    await signAndSendTransactions({
      transactions: [pongTransaction],
      transactionsDisplayInfo: PONG_TRANSACTION_INFO
    });
  };

  const sendPongTransactionFromAbi = async () => {
    const scFactory = await getSmartContractFactory();
    const pongTransaction = scFactory.createTransactionForExecute(
      new Address(address),
      {
        gasLimit: BigInt(60000000),
        function: 'pong',
        contract: new Address(contractAddress),
        nativeTransferAmount: BigInt(0)
      }
    );

    const sessionId = await signAndSendTransactions({
      transactions: [pongTransaction],
      transactionsDisplayInfo: PONG_TRANSACTION_INFO
    });

    return sessionId;
  };

  const sendPongTransactionFromService = async (
    transactions: Transaction[]
  ) => {
    const sessionId = await signAndSendTransactions({
      transactions,
      transactionsDisplayInfo: PONG_TRANSACTION_INFO
    });

    return sessionId;
  };

  return {
    sendPingTransaction,
    sendPingTransactionFromAbi,
    sendPongTransaction,
    sendPongTransactionFromAbi,
    sendPingTransactionFromService,
    sendPongTransactionFromService
  };
};
