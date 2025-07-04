import { Test, TestingModule } from '@nestjs/testing';

import { MXProxyService } from '../../../services/dharitri-communication/drt.proxy.service';
import { ProxyPairTransactionsService } from '../services/proxy-pair/proxy.pair.transactions.service';
import { PairService } from 'src/modules/pair/services/pair.service';
import { Address } from '@terradharitri/sdk-core';
import { WrapTransactionsService } from 'src/modules/wrapping/services/wrap.transactions.service';
import { ApiConfigService } from 'src/helpers/api.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MXProxyServiceProvider } from 'src/services/dharitri-communication/drt.proxy.service.mock';
import {
    ProxyAbiServiceMock,
    ProxyPairAbiServiceProvider,
} from '../mocks/proxy.abi.service.mock';
import { ProxyAbiServiceV2 } from '../v2/services/proxy.v2.abi.service';
import { WrapAbiServiceProvider } from 'src/modules/wrapping/mocks/wrap.abi.service.mock';
import { WrapService } from 'src/modules/wrapping/services/wrap.service';
import { TokenServiceProvider } from 'src/modules/tokens/mocks/token.service.mock';
import { RouterAbiServiceProvider } from 'src/modules/router/mocks/router.abi.service.mock';
import { PairAbiServiceProvider } from 'src/modules/pair/mocks/pair.abi.service.mock';
import { PairComputeServiceProvider } from 'src/modules/pair/mocks/pair.compute.service.mock';
import { PairAbiService } from 'src/modules/pair/services/pair.abi.service';
import { ContextGetterServiceProvider } from 'src/services/context/mocks/context.getter.service.mock';
import { encodeTransactionData } from 'src/helpers/helpers';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { MXApiServiceProvider } from 'src/services/dharitri-communication/drt.api.service.mock';

describe('TransactionProxyPairService', () => {
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
                ApiConfigService,
                ConfigService,
                MXProxyServiceProvider,
                PairService,
                PairAbiServiceProvider,
                PairComputeServiceProvider,
                WrapAbiServiceProvider,
                WrapTransactionsService,
                WrapService,
                TokenServiceProvider,
                ProxyPairTransactionsService,
                ProxyPairAbiServiceProvider,
                {
                    provide: ProxyAbiServiceV2,
                    useClass: ProxyAbiServiceMock,
                },
                RouterAbiServiceProvider,
                ContextGetterServiceProvider,
                MXApiServiceProvider,
            ],
        }).compile();
    });

    it('should be defined', () => {
        const service: ProxyPairTransactionsService =
            module.get<ProxyPairTransactionsService>(
                ProxyPairTransactionsService,
            );
        expect(service).toBeDefined();
    });

    it('should get add liquidity batch transaction REWA first token', async () => {
        const firstTokenAmount = '10';
        const secondTokenAmount = '9';

        const service: ProxyPairTransactionsService =
            module.get<ProxyPairTransactionsService>(
                ProxyPairTransactionsService,
            );
        const drtProxy = module.get<MXProxyService>(MXProxyService);
        const pairAbi = module.get<PairAbiService>(PairAbiService);

        jest.spyOn(drtProxy, 'getAddressShardID').mockImplementation(
            async () => 0,
        );
        jest.spyOn(pairAbi, 'firstTokenID').mockImplementation(
            async () => 'WREWA-123456',
        );
        jest.spyOn(pairAbi, 'secondTokenID').mockImplementation(
            async () => 'MOA-123456',
        );

        const liquidityBatchTransactions = await service.addLiquidityProxyBatch(
            'drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            'drt1qqqqqqqqqqqqqpgqrc4pg2xarca9z34njcxeur622qmfjp8w2jps6e79sp',
            {
                pairAddress: Address.Zero().bech32(),
                tokens: [
                    {
                        tokenID: 'REWA',
                        nonce: 0,
                        amount: firstTokenAmount,
                    },
                    {
                        tokenID: 'LKMOA-123456',
                        nonce: 1,
                        amount: secondTokenAmount,
                    },
                ],
                tolerance: 0.01,
            },
        );

        const [wrapRewaTransaction, addLiquidityProxy] =
            liquidityBatchTransactions;
        expect(wrapRewaTransaction.value).toEqual(firstTokenAmount);
        expect(addLiquidityProxy.data).toEqual(
            encodeTransactionData(
                'MultiDCDTNFTTransfer@000000000000000005001e2a1428dd1e3a5146b3960d9e0f4a50369904ee5483@02@WREWA-123456@@10@LKMOA-123456@01@09@addLiquidityProxy@0000000000000000000000000000000000000000000000000000000000000000@09@08',
            ),
        );
    });

    it('should get add liquidity batch transaction REWA second token', async () => {
        const firstTokenAmount = '10';
        const secondTokenAmount = '9';
        const service: ProxyPairTransactionsService =
            module.get<ProxyPairTransactionsService>(
                ProxyPairTransactionsService,
            );
        const drtProxy = module.get<MXProxyService>(MXProxyService);
        const pairAbi = module.get<PairAbiService>(PairAbiService);

        jest.spyOn(drtProxy, 'getAddressShardID').mockImplementation(
            async () => 0,
        );
        jest.spyOn(pairAbi, 'firstTokenID').mockImplementation(
            async () => 'WREWA-123456',
        );
        jest.spyOn(pairAbi, 'secondTokenID').mockImplementation(
            async () => 'MOA-123456',
        );

        const liquidityBatchTransactions = await service.addLiquidityProxyBatch(
            'drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            'drt1qqqqqqqqqqqqqpgqrc4pg2xarca9z34njcxeur622qmfjp8w2jps6e79sp',
            {
                pairAddress: Address.Zero().bech32(),
                tokens: [
                    {
                        tokenID: 'LKMOA-123456',
                        nonce: 1,
                        amount: firstTokenAmount,
                    },
                    {
                        tokenID: 'REWA',
                        nonce: 0,
                        amount: secondTokenAmount,
                    },
                ],
                tolerance: 0.01,
            },
        );

        const [wrapRewaTransaction, addLiquidityProxy] =
            liquidityBatchTransactions;
        expect(wrapRewaTransaction.value).toEqual(secondTokenAmount);
        expect(addLiquidityProxy.data).toEqual(
            encodeTransactionData(
                'MultiDCDTNFTTransfer@000000000000000005001e2a1428dd1e3a5146b3960d9e0f4a50369904ee5483@02@WREWA-123456@@09@LKMOA-123456@01@10@addLiquidityProxy@0000000000000000000000000000000000000000000000000000000000000000@08@09',
            ),
        );
    });
});
