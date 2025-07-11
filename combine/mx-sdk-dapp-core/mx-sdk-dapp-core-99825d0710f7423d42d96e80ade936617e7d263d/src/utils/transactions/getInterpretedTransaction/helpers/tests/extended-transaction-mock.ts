import {
  ServerTransactionType,
  TransactionOperationActionTypeEnum,
  TransactionActionCategoryEnum,
  TransactionActionsEnum,
  VisibleTransactionOperationType
} from 'types/serverTransactions.types';
import { DcdtEnumType } from 'types/tokens.types';
import { baseTransactionMock } from './base-transaction-mock';

export const transactionMock: ServerTransactionType = {
  ...baseTransactionMock,
  action: {
    name: TransactionActionsEnum.transfer,
    category: TransactionActionCategoryEnum.scCall,
    arguments: {
      token: 'token',
      token1: 'token1',
      token2: 'token2',
      transfers: 'transfers',
      null: null,
      undefined: undefined
    }
  },
  receiverAssets: {
    name: 'john doe',
    description: 'description',
    iconPng: 'icon.png',
    iconSvg: 'icon.svg',
    tags: ['@tag1', '@tag2']
  },
  operations: [
    {
      name: 'send',
      type: VisibleTransactionOperationType.rewa,
      action: TransactionOperationActionTypeEnum.transfer,
      dcdtType: DcdtEnumType.FungibleDCDT,
      receiver:
        'drt1qqqqqqqqqqqqqpgq4gdcg0k83u7lpv4s4532w3au9y9h0vm70eqq88sr45',
      sender: 'drt1axhx4kenjlae6sknq7zjg2g4fvzavv979r2fg425p62wkl84avtqd4f00j',
      value: '1',
      decimals: 4,
      identifier: 'REWA',
      message: 'message 0'
    },
    {
      name: 'send',
      type: VisibleTransactionOperationType.rewa,
      action: TransactionOperationActionTypeEnum.transfer,
      dcdtType: DcdtEnumType.FungibleDCDT,
      receiver:
        'drt1qqqqqqqqqqqqqpgq4gdcg0k83u7lpv4s4532w3au9y9h0vm70eqq88sr45',
      sender: 'drt1axhx4kenjlae6sknq7zjg2g4fvzavv979r2fg425p62wkl84avtqd4f00j',
      value: '1',
      decimals: 4,
      identifier: 'REWA',
      message: 'message 1'
    }
  ],
  results: [
    {
      callType: '',
      value: '1',
      gasLimit: 100,
      gasPrice: 0.001,
      hash: 'tx-hash',
      nonce: 0,
      sender: 'sender-hash',
      originalTxHash: 'original-tx-hash',
      prevTxHash: 'prev-tx-hash',
      returnMessage: 'message 0'
    },
    {
      callType: '',
      value: '1',
      gasLimit: 100,
      gasPrice: 0.001,
      hash: 'tx-hash',
      nonce: 0,
      sender: 'sender-hash',
      originalTxHash: 'original-tx-hash',
      prevTxHash: 'prev-tx-hash',
      returnMessage: 'message 1'
    }
  ],
  receipt: {
    data: '@some-data',
    value: '1000',
    sender: 'sender-hash'
  }
};
