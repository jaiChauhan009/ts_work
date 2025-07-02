import { Injectable } from '@nestjs/common';
import { Token, TokenTransfer } from '@terradharitri/sdk-core';
import { TransactionModel } from '../../../models/transaction.model';
import { mxConfig, gasConfig } from '../../../config';
import { WrapService } from './wrap.service';
import { MXProxyService } from '../../../services/dharitri-communication/mx.proxy.service';
import { TransactionOptions } from 'src/modules/common/transaction.options';

@Injectable()
export class WrapTransactionsService {
    constructor(
        private readonly mxProxy: MXProxyService,
        private readonly wrapService: WrapService,
    ) {}

    async wrapRewa(sender: string, amount: string): Promise<TransactionModel> {
        const shardID = await this.mxProxy.getAddressShardID(sender);

        return this.mxProxy.getWrapSmartContractTransaction(
            shardID,
            new TransactionOptions({
                function: 'wrapRewa',
                chainID: mxConfig.chainID,
                gasLimit: gasConfig.wrapREWA,
                sender: sender,
                nativeTransferAmount: amount,
            }),
        );
    }

    async unwrapRewa(
        sender: string,
        amount: string,
    ): Promise<TransactionModel> {
        const [shardID, wrappedRewaToken] = await Promise.all([
            this.mxProxy.getAddressShardID(sender),
            this.wrapService.wrappedRewaToken(),
        ]);

        return this.mxProxy.getWrapSmartContractTransaction(
            shardID,
            new TransactionOptions({
                function: 'unwrapRewa',
                chainID: mxConfig.chainID,
                gasLimit: gasConfig.wrapREWA,
                sender: sender,
                tokenTransfers: [
                    new TokenTransfer({
                        token: new Token({
                            identifier: wrappedRewaToken.identifier,
                        }),
                        amount: BigInt(amount),
                    }),
                ],
            }),
        );
    }
}
