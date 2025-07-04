import { EMPTY_PPU } from 'constants/placeholders.constants';
import { UITagsEnum } from 'constants/UITags.enum';
import { Transaction } from 'lib/sdkCore';
import { MvxSignTransactionsPanel } from 'lib/sdkDappCoreUi';
import { NftEnumType } from 'types/tokens.types';
import {
  FungibleTransactionType,
  ISignTransactionsPanelData,
  SignEventsEnum,
  TokenType,
  ISignTransactionsPanelCommonData
} from './types/signTransactionsPanel.types';
import { SidePanelBaseManager } from '../SidePanelBaseManager/SidePanelBaseManager';

export class SignTransactionsStateManager extends SidePanelBaseManager<
  MvxSignTransactionsPanel,
  ISignTransactionsPanelData,
  SignEventsEnum
> {
  private static instance: SignTransactionsStateManager;
  public readonly addressesPerPage = 10;

  private _ppuMap: Record<
    number, // nonce
    {
      initialGasPrice: number;
      ppu: ISignTransactionsPanelCommonData['ppu'];
    }
  > = {};

  protected initialData: ISignTransactionsPanelData = {
    commonData: {
      transactionsCount: 0,
      rewaLabel: '',
      currentIndex: 0,
      ppuOptions: []
    },
    tokenTransaction: null,
    nftTransaction: null,
    sftTransaction: null
  };

  protected data: ISignTransactionsPanelData = { ...this.initialData };

  public static getInstance(): SignTransactionsStateManager {
    if (!SignTransactionsStateManager.instance) {
      SignTransactionsStateManager.instance =
        new SignTransactionsStateManager();
    }
    return SignTransactionsStateManager.instance;
  }

  constructor() {
    super('sign-transactions');
    this.data = { ...this.initialData };
  }

  public async init() {
    await super.init();
    this.resetData();
  }

  public async openSignTransactions(
    data: ISignTransactionsPanelData = this.data
  ) {
    await this.openUI(data);
  }

  public initializeGasPriceMap(transactions: Transaction[]) {
    transactions
      .filter((tx) => tx != null)
      .forEach((transaction) => {
        const initialGasPrice = transaction ? Number(transaction.gasPrice) : 0;
        const ppu = EMPTY_PPU;
        this.updateGasPriceMap({
          nonce: Number(transaction.nonce),
          ppu,
          initialGasPrice
        });
      });
  }

  public updateGasPriceMap({
    nonce,
    ppu,
    initialGasPrice
  }: {
    nonce: number;
    initialGasPrice?: number;
    ppu: ISignTransactionsPanelCommonData['ppu'];
  }) {
    this._ppuMap[nonce] = {
      ...this._ppuMap[nonce],
      ppu
    };
    if (initialGasPrice) {
      this._ppuMap[nonce].initialGasPrice = initialGasPrice;
    }
    this.updateCommonData({ ppu });
  }

  public updateCommonData(
    newCommonData: Partial<ISignTransactionsPanelCommonData>
  ): void {
    this.data.commonData = {
      ...this.data.commonData,
      ...newCommonData
    };
    this.notifyDataUpdate();
  }

  public updateTokenTransaction(
    tokenData: ISignTransactionsPanelData['tokenTransaction']
  ): void {
    this.data.tokenTransaction = tokenData;
    this.data.sftTransaction = null;
    this.data.nftTransaction = null;

    this.notifyDataUpdate();
  }

  public updateNonFungibleTransaction(
    type: TokenType,
    fungibleData: FungibleTransactionType
  ): void {
    switch (type) {
      case NftEnumType.NonFungibleDCDT:
        this.data.nftTransaction = fungibleData;
        this.data.tokenTransaction = null;
        this.data.sftTransaction = null;
        break;
      case NftEnumType.SemiFungibleDCDT:
        this.data.sftTransaction = fungibleData;
        this.data.nftTransaction = null;
        this.data.tokenTransaction = null;
        break;
      default:
        break;
    }

    this.notifyDataUpdate();
  }

  public get currentScreenIndex() {
    return this.data.commonData.currentIndex;
  }

  public get ppuMap() {
    return this._ppuMap;
  }

  protected getUIElementName(): UITagsEnum {
    return UITagsEnum.SIGN_TRANSACTIONS_PANEL;
  }

  protected getOpenEventName(): SignEventsEnum {
    return SignEventsEnum.OPEN_SIGN_TRANSACTIONS_PANEL;
  }

  protected getCloseEventName(): SignEventsEnum {
    return SignEventsEnum.CLOSE_SIGN_TRANSACTIONS_PANEL;
  }

  protected getDataUpdateEventName(): SignEventsEnum {
    return SignEventsEnum.DATA_UPDATE;
  }

  protected async setupEventListeners() {
    if (!this.eventBus) {
      return;
    }

    this.eventBus.subscribe(
      SignEventsEnum.CLOSE_SIGN_TRANSACTIONS_PANEL,
      this.handleCloseUI.bind(this)
    );
  }
}
