/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/globals.css';

import { walletConnectV2ProjectId } from './config';

import { InMemoryProvider } from './provider/inMemoryProvider';
import {
  safeWindow,
  ICustomProvider,
  ProviderTypeEnum,
  InitAppType,
  EnvironmentsEnum
} from '@/lib';

const ADDITIONAL_PROVIDERS = {
  inMemoryProvider: 'inMemoryProvider'
} as const;

export const ExtendedProviders = {
  ...ProviderTypeEnum,
  ...ADDITIONAL_PROVIDERS
} as const;

const DEFAULT_TOAST_LIEFTIME = 5000;

const providers: ICustomProvider<ProviderTypeEnum>[] = [
  {
    name: ADDITIONAL_PROVIDERS.inMemoryProvider,
    type: ExtendedProviders.inMemoryProvider,
    constructor: async (options) => new InMemoryProvider(options)
  }
];

(safeWindow as any).dharitri = {};
// Option 1: Add providers using the `window.providers` array
(safeWindow as any).dharitri.providers = providers;

export const config: InitAppType = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    nativeAuth: true,
    environment: EnvironmentsEnum.devnet,
    network: {
      walletAddress: 'https://devnet-wallet.dharitri.org'
    },
    providers: {
      walletConnect: {
        walletConnectV2ProjectId
      }
    },
    successfulToastLifetime: DEFAULT_TOAST_LIEFTIME
  }

  // Option 2: Add providers using the config `customProviders` array
  // customProviders: [customWalletProvider]
};
