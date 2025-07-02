import { Injectable } from "@nestjs/common";
import { DcdtType } from "src/endpoints/dcdt/entities/dcdt.type";
import { TransactionAction } from "../../entities/transaction.action";
import { TransactionActionCategory } from "../../entities/transaction.action.category";
import { TransactionMetadata } from "../../entities/transaction.metadata";
import { TransactionActionDcdtNftRecognizerService } from "../dcdt/transaction.action.dcdt.nft.recognizer.service";
import { MexFunction } from "./entities/mex.function.options";
import { MexSettings } from "../../../../mex/entities/mex.settings";
import { MexSettingsService } from "../../../../mex/mex.settings.service";
import { NumberUtils } from "@terradharitri/sdk-nestjs-common";

@Injectable()
export class MexWrapActionRecognizerService {
  constructor(
    private readonly transactionActionDcdtNftRecognizerService: TransactionActionDcdtNftRecognizerService,
    private readonly mexSettingsService: MexSettingsService,
  ) { }

  recognize(settings: MexSettings, metadata: TransactionMetadata): TransactionAction | undefined {
    if (!settings.wrapContracts.includes(metadata.receiver)) {
      return undefined;
    }

    switch (metadata.functionName) {
      case MexFunction.wrapEgld:
        return this.getWrapAction(metadata);
      case MexFunction.unwrapEgld:
        return this.getUnwrapAction(metadata);
      default:
        return undefined;
    }
  }

  private getWrapAction(metadata: TransactionMetadata): TransactionAction | undefined {
    const wegldId = this.mexSettingsService.getWegldId();
    if (!wegldId) {
      return undefined;
    }

    const valueDenominated = NumberUtils.toDenominatedString(metadata.value);


    const result = new TransactionAction();
    result.category = TransactionActionCategory.mex;
    result.name = MexFunction.wrapEgld;
    result.description = `Wrap ${valueDenominated} EGLD`;
    result.arguments = {
      token: {
        type: DcdtType.FungibleDCDT,
        name: 'WrappedEGLD',
        token: wegldId,
        ticker: wegldId.split('-')[0],
        decimals: 18,
        value: metadata.value.toString(),
      },
      receiver: metadata.receiver,
    };

    return result;
  }

  private getUnwrapAction(metadata: TransactionMetadata): TransactionAction | undefined {
    return this.transactionActionDcdtNftRecognizerService.getMultiTransferActionWithTicker(metadata, TransactionActionCategory.mex, MexFunction.unwrapEgld, 'Unwrap');
  }
}
