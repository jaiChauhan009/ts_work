import { WalletConnectV2ProviderOptionsType } from '@terradharitri/sdk-wallet-connect-provider/out';

export enum WalletConnectV2Error {
  invalidAddress = 'Invalid address',
  invalidConfig = 'Invalid WalletConnect setup',
  invalidTopic = 'Expired connection',
  sessionExpired = 'Unable to connect to existing session',
  connectError = 'Unable to connect',
  userRejected = 'User rejected connection proposal',
  userRejectedExisting = 'User rejected existing connection proposal',
  errorLogout = 'Unable to remove existing pairing',
  invalidChainID = 'Invalid chainID',
  actionError = 'Unable to send event'
}

// types here need to be synced with the types in sdk-dapp-core-ui
export enum WalletConnectEventsEnum {
  CLOSE_WALLET_CONNECT_PANEL = 'CLOSE_WALLET_CONNECT_PANEL',
  OPEN_WALLET_CONNECT_PANEL = 'OPEN_WALLET_CONNECT_PANEL',
  DATA_UPDATE = 'DATA_UPDATE',
  UI_DISCONNECTED = 'UI_DISCONNECTED'
}

export interface IWalletConnectModalData {
  wcURI: string;
  shouldClose?: boolean;
}

export interface WalletConnectConfig {
  walletConnectV2ProjectId: string;
  walletConnectV2RelayAddress?: string;
  walletConnectV2Options?: WalletConnectV2ProviderOptionsType;
  customRequestMethods?: string[];
  walletConnectDeepLink?: string;
}
