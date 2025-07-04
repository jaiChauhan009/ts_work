// types here need to be synced with the types in sdk-dapp-core-ui sign-transactions-modal.types.ts
import type { DcdtEnumType, NftEnumType } from 'types/tokens.types';

export interface ITransactionData {
  receiver?: string;
  data?: string;
  value?: string;
}

export type FungibleTransactionType = {
  amount: string;
  identifier?: string;
  imageURL: string;
};

export type TokenType = DcdtEnumType | NftEnumType;

export interface ISignTransactionsPanelCommonData {
  receiver?: string;
  data?: string;
  gasPrice?: string;
  /**
   * ppu - Price Per Unit
   * a constant that is used to calculate the gas price inside `recommendGasPrice`
   */
  ppu?: number;
  ppuOptions: {
    label: string;
    value: number;
  }[];
  gasLimit?: string;
  transactionsCount: number;
  tokenType?: TokenType;
  rewaLabel: string;
  feeLimit?: string;
  feeInFiatLimit?: string | null;
  currentIndex: number;
  needsSigning?: boolean;
  isEditable?: boolean;
  highlight?: string | null;
  scCall?: string | null;
}

export interface ISignTransactionsPanelData {
  shouldClose?: true;
  commonData: ISignTransactionsPanelCommonData;
  tokenTransaction: {
    identifier?: string;
    amount: string;
    usdValue: string;
  } | null;
  nftTransaction: FungibleTransactionType | null;
  sftTransaction: FungibleTransactionType | null;
}

export enum SignEventsEnum {
  CONFIRM = 'CONFIRM', // can be sign or next
  BACK = 'BACK',
  DATA_UPDATE = 'DATA_UPDATE',
  SET_PPU = 'SET_PPU',
  OPEN_SIGN_TRANSACTIONS_PANEL = 'OPEN_SIGN_TRANSACTIONS_PANEL',
  CLOSE_SIGN_TRANSACTIONS_PANEL = 'CLOSE_SIGN_TRANSACTIONS_PANEL'
}
