import { safeWindow } from 'constants/index';
import { PendingTransactionsStateManager } from 'core/managers/internal/PendingTransactionsStateManager/PendingTransactionsStateManager';
import { SignTransactionsStateManager } from 'core/managers/internal/SignTransactionsStateManager/SignTransactionsStateManager';
import { ToastManager } from 'core/managers/internal/ToastManager/ToastManager';
import { login } from 'core/providers/DappProvider/helpers/login/login';
import { restoreProvider } from 'core/providers/helpers/restoreProvider';
import { ProviderFactory } from 'core/providers/ProviderFactory';
import {
  ICustomProvider,
  ProviderTypeEnum
} from 'core/providers/types/providerFactory.types';
import { getDefaultNativeAuthConfig } from 'services/nativeAuth/methods/getDefaultNativeAuthConfig';
import { NativeAuthConfigType } from 'services/nativeAuth/nativeAuth.types';
import { initializeNetwork } from 'store/actions';
import {
  setCrossWindowConfig,
  setNativeAuthConfig,
  setWalletConnectConfig
} from 'store/actions/config/configActions';
import { defaultStorageCallback } from 'store/storage';
import { initStore } from 'store/store';
import { getIsInIframe } from 'utils/window/getIsInIframe';
import { InitAppType } from './initApp.types';
import { getIsLoggedIn } from '../account/getIsLoggedIn';
import { registerWebsocketListener } from './websocket/registerWebsocket';
import { getAccount } from '../account/getAccount';
import { trackTransactions } from '../trackTransactions/trackTransactions';

const defaultInitAppProps = {
  storage: {
    getStorageCallback: defaultStorageCallback
  }
};

/**
 * Flag indicating whether the app has already been initialized.
 *
 * Prevents repeated initialization steps such as provider restoration,
 * websocket listener registration, and transaction tracking setup.
 * This ensures that multiple calls to `initApp` do not cause duplicated
 * subscriptions or side effects.
 *
 * @internal
 */
let isAppInitialized = false;

/**
 * Initializes the dApp with the given configuration.
 * @param props - The configuration for the dApp initialization.
 *
 * @example
 * ```ts
   initApp({
      nativeAuth: true,
      environment: EnvironmentsEnum.devnet
   });
 *  ```
 * */
export async function initApp({
  storage = defaultInitAppProps.storage,
  dAppConfig,
  customProviders
}: InitAppType) {
  initStore(storage.getStorageCallback);

  const { apiAddress } = await initializeNetwork({
    customNetworkConfig: dAppConfig.network,
    environment: dAppConfig.environment
  });

  if (dAppConfig?.nativeAuth) {
    const nativeAuthConfig: NativeAuthConfigType =
      typeof dAppConfig.nativeAuth === 'boolean' &&
      dAppConfig.nativeAuth === true
        ? getDefaultNativeAuthConfig(apiAddress)
        : dAppConfig.nativeAuth;

    setNativeAuthConfig(nativeAuthConfig);
  }

  if (dAppConfig?.providers?.walletConnect) {
    setWalletConnectConfig(dAppConfig.providers.walletConnect);
  }

  if (dAppConfig?.providers?.crossWindow) {
    setCrossWindowConfig(dAppConfig.providers.crossWindow);
  }

  const isInIframe = getIsInIframe();
  const isLoggedIn = getIsLoggedIn();
  const account = getAccount();

  if (isInIframe) {
    const provider = await ProviderFactory.create({
      type: ProviderTypeEnum.webview
    });

    const isInitialized = provider.isInitialized();

    if (isInitialized && !isLoggedIn) {
      await login(provider.getProvider());
    }
  }

  const toastManager = ToastManager.getInstance({
    successfulToastLifetime: dAppConfig.successfulToastLifetime
  });

  const pendingTransactionsStateManager =
    PendingTransactionsStateManager.getInstance();

  const signTransactionsStateManager =
    SignTransactionsStateManager.getInstance();

  await Promise.all([
    toastManager.init(),
    pendingTransactionsStateManager.init(),
    signTransactionsStateManager.init()
  ]);

  const usedProviders: ICustomProvider[] = [
    ...((safeWindow as any)?.dharitri?.providers ?? []),
    ...(customProviders || [])
  ];

  const uniqueProviders = usedProviders.filter(
    (provider, index, arr) =>
      index === arr.findIndex((item) => item.type === provider.type)
  );

  ProviderFactory.customProviders = uniqueProviders || [];

  if (isLoggedIn && !isAppInitialized) {
    await restoreProvider();
    await registerWebsocketListener(account.address);
    trackTransactions();
  }

  isAppInitialized = true;
}
