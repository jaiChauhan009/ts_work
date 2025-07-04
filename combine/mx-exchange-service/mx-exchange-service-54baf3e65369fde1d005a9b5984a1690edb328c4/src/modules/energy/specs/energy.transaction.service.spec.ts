import { Test, TestingModule } from '@nestjs/testing';
import { MXProxyServiceProvider } from 'src/services/dharitri-communication/drt.proxy.service.mock';
import { TransactionModel } from 'src/models/transaction.model';
import { encodeTransactionData } from 'src/helpers/helpers';
import { gasConfig, drtConfig, scAddress } from 'src/config';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ApiConfigService } from 'src/helpers/api.config.service';
import winston from 'winston';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { MXApiServiceProvider } from 'src/services/dharitri-communication/drt.api.service.mock';
import { ContextGetterServiceProvider } from 'src/services/context/mocks/context.getter.service.mock';
import { MXGatewayServiceProvider } from 'src/services/dharitri-communication/drt.gateway.service.mock';
import { InputTokenModel } from 'src/models/inputToken.model';
import { EnergyTransactionService } from '../services/energy.transaction.service';
import { Address } from '@terradharitri/sdk-core';
import { UnlockType } from '../models/energy.model';

describe('EnergyTransactionService', () => {
    let module: TestingModule;
    const senderAddress = Address.newFromHex(
        '0000000000000000000000000000000000000000000000000000000000000001',
    ).toBech32();

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
                EnergyTransactionService,
                MXProxyServiceProvider,
                MXApiServiceProvider,
                MXGatewayServiceProvider,
                ContextGetterServiceProvider,
                ApiConfigService,
            ],
        }).compile();
    });

    it('should be defined', () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);
        expect(service).toBeDefined();
    });

    it('should return a lock tokens transaction with meta dcdt', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.lockTokens(
            senderAddress,
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            720,
        );

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `DCDTNFTTransfer@XMOA-123456@01@1000000000000000000@${scAddress.simpleLockEnergy}@lockTokens@720`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.lockTokens,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return a lock tokens transaction with fungible dcdt', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.lockTokens(
            senderAddress,
            new InputTokenModel({
                tokenID: 'MOA-123456',
                nonce: 0,
                amount: '1000000000000000000',
            }),
            720,
        );

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `DCDTTransfer@MOA-123456@1000000000000000000@lockTokens@720`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.lockTokens,
                value: '0',
                receiver: scAddress.simpleLockEnergy,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return early unlock transaction', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.unlockTokens(
            senderAddress,
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            UnlockType.EARLY_UNLOCK,
        );

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `DCDTNFTTransfer@XMOA-123456@01@1000000000000000000@${scAddress.simpleLockEnergy}@unlockEarly`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.unlockTokens.unlockEarly,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return reduce period unlock transaction', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.unlockTokens(
            senderAddress,
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            UnlockType.REDUCE_PERIOD,
            400,
        );

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `DCDTNFTTransfer@XMOA-123456@01@1000000000000000000@${scAddress.simpleLockEnergy}@reduceLockPeriod@400`,
                ),
                gasPrice: 1000000000,
                gasLimit:
                    gasConfig.simpleLockEnergy.unlockTokens.reduceLockPeriod,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return term unlock transaction', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.unlockTokens(
            senderAddress,
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            UnlockType.TERM_UNLOCK,
        );

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `DCDTNFTTransfer@XMOA-123456@01@1000000000000000000@${scAddress.simpleLockEnergy}@unlockTokens`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.unlockTokens.default,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return merge tokens transaction', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.mergeTokens(senderAddress, [
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            new InputTokenModel({
                tokenID: 'XMOA-123456',
                nonce: 2,
                amount: '2000000000000000000',
            }),
        ]);

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `MultiDCDTNFTTransfer@${scAddress.simpleLockEnergy}@02@XMOA-123456@01@1000000000000000000@XMOA-123456@02@2000000000000000000@mergeTokens`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.defaultMergeTokens * 2,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });

    it('should return migrate old tokens transaction', async () => {
        const service: EnergyTransactionService =
            module.get<EnergyTransactionService>(EnergyTransactionService);

        const transaction = await service.migrateOldTokens(senderAddress, [
            new InputTokenModel({
                tokenID: 'LKMOA-abcdef',
                nonce: 1,
                amount: '1000000000000000000',
            }),
            new InputTokenModel({
                tokenID: 'LKMOA-abcdef',
                nonce: 2,
                amount: '2000000000000000000',
            }),
        ]);

        expect(transaction).toEqual(
            new TransactionModel({
                chainID: drtConfig.chainID,
                nonce: 0,
                data: encodeTransactionData(
                    `MultiDCDTNFTTransfer@${scAddress.simpleLockEnergy}@02@LKMOA-abcdef@01@1000000000000000000@LKMOA-abcdef@02@2000000000000000000@migrateOldTokens`,
                ),
                gasPrice: 1000000000,
                gasLimit: gasConfig.simpleLockEnergy.migrateOldTokens * 2,
                value: '0',
                receiver: senderAddress,
                sender: senderAddress,
                options: undefined,
                signature: undefined,
                version: 2,
            }),
        );
    });
});
