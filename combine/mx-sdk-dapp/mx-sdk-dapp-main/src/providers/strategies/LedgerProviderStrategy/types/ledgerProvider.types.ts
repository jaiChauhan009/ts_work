import { IProviderAccount } from '@terradharitri/sdk-wallet-connect-provider/out';

export type LedgerConfigType = {
  version: string;
  dataEnabled: boolean;
};

export type LedgerLoginType = (options?: {
  addressIndex: number;
}) => Promise<IProviderAccount>;
