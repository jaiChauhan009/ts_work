import { Test, TestingModule } from '@nestjs/testing';
import { DistributionTransactionsService } from '../services/distribution.transactions.service';
import { MXProxyServiceProvider } from 'src/services/dharitri-communication/drt.proxy.service.mock';
import { TransactionModel } from 'src/models/transaction.model';
import { encodeTransactionData } from 'src/helpers/helpers';
import { gasConfig, drtConfig } from 'src/config';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ApiConfigService } from 'src/helpers/api.config.service';
import winston from 'winston';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { Address } from '@terradharitri/sdk-core';

describe('DistributionTransactionsService', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                WinstonModule.forRoot({
                    transports: [new winston.transports.Console({})],
                }),
                ConfigModule.forRoot({}),
                DynamicModuleUtils.getCacheModule(),
            ],
            providers: [
                DistributionTransactionsService,
                MXProxyServiceProvider,
                ApiConfigService,
            ],
        }).compile();
    });

    it('should be defined', () => {
        const service: DistributionTransactionsService =
            module.get<DistributionTransactionsService>(
                DistributionTransactionsService,
            );
        expect(service).toBeDefined();
    });

    it('should return claim locked assets transaction', async () => {
        const service: DistributionTransactionsService =
            module.get<DistributionTransactionsService>(
                DistributionTransactionsService,
            );
        const senderAddress = Address.newFromHex(
            '0000000000000000000000000000000000000000000000000000000000000001',
        ).toBech32();

        const transaction = await service.claimLockedAssets(senderAddress);
        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                data: encodeTransactionData('claimLockedAssets'),
                gasLimit: gasConfig.claimLockedAssets,
                gasPrice: 1000000000,
                nonce: 0,
                options: undefined,
                receiver:
                    'drt1qqqqqqqqqqqqqpgq29s98mhxwyknmxcpdtdx6nm0wkvnkvwe0n4s0a6587',
                sender: senderAddress,
                receiverUsername: undefined,
                senderUsername: undefined,
                signature: undefined,
                value: '0',
                version: 2,
                guardian: undefined,
                guardianSignature: undefined,
            }),
        );
    });
});
