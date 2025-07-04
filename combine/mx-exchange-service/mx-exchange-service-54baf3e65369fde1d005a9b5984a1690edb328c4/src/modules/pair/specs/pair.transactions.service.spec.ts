import { Test, TestingModule } from '@nestjs/testing';
import { WrapTransactionsService } from 'src/modules/wrapping/services/wrap.transactions.service';
import { PairTransactionService } from '../services/pair.transactions.service';
import { PairService } from '../services/pair.service';
import { MXProxyServiceProvider } from 'src/services/dharitri-communication/drt.proxy.service.mock';
import { ApiConfigService } from 'src/helpers/api.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InputTokenModel } from 'src/models/inputToken.model';
import { Address } from '@terradharitri/sdk-core';
import { encodeTransactionData } from 'src/helpers/helpers';
import { drtConfig, gasConfig } from 'src/config';
import { WrapAbiServiceProvider } from 'src/modules/wrapping/mocks/wrap.abi.service.mock';
import { TokenServiceProvider } from 'src/modules/tokens/mocks/token.service.mock';
import { WrapService } from 'src/modules/wrapping/services/wrap.service';
import { PairAbiServiceProvider } from '../mocks/pair.abi.service.mock';
import { ContextGetterServiceProvider } from 'src/services/context/mocks/context.getter.service.mock';
import { PairComputeServiceProvider } from '../mocks/pair.compute.service.mock';
import { RouterAbiServiceProvider } from 'src/modules/router/mocks/router.abi.service.mock';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { ComposableTasksTransactionService } from 'src/modules/composable-tasks/services/composable.tasks.transaction';
import { MXApiServiceProvider } from 'src/services/dharitri-communication/drt.api.service.mock';

describe('TransactionPairService', () => {
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
                ConfigService,
                ApiConfigService,
                MXProxyServiceProvider,
                ContextGetterServiceProvider,
                PairService,
                PairAbiServiceProvider,
                PairComputeServiceProvider,
                RouterAbiServiceProvider,
                WrapAbiServiceProvider,
                WrapTransactionsService,
                WrapService,
                TokenServiceProvider,
                ComposableTasksTransactionService,
                PairTransactionService,
                MXApiServiceProvider,
            ],
        }).compile();
    });

    it('should be defined', () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        expect(service).toBeDefined();
    });

    it('should get add initial liquidity batch transaction', async () => {
        const firstTokenAmount = '10000000000000000000';
        const secondTokenAmount = '9000000000000000000';

        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const initialLiquidityBatchTransactions =
            await service.addInitialLiquidityBatch(senderAddress, {
                pairAddress: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                tokens: [
                    {
                        tokenID: 'MOA-123456',
                        nonce: 0,
                        amount: firstTokenAmount,
                    },
                    {
                        tokenID: 'REWA',
                        nonce: 0,
                        amount: secondTokenAmount,
                    },
                ],
                tolerance: 0.01,
            });

        const [wrapRewaTransaction, addLiquidityTransaction] =
            initialLiquidityBatchTransactions;

        expect(wrapRewaTransaction).toEqual({
            nonce: 0,
            value: secondTokenAmount,
            receiver:
                'drt1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq8axq7c',
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.wrapREWA,
            data: encodeTransactionData('wrapRewa'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
        expect(addLiquidityTransaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: senderAddress,
            sender: senderAddress,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.addLiquidity,
            data: encodeTransactionData(
                `MultiDCDTNFTTransfer@${Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32()}@2@WREWA-123456@@9000000000000000000@MOA-123456@@10000000000000000000@addInitialLiquidity`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
        });
    });

    it('should get add initial liquidity transaction', async () => {
        const firstTokenAmount = '10000000000000000000';
        const secondTokenAmount = '9000000000000000000';

        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const addLiquidityTransaction = await service.addInitialLiquidity(
            senderAddress,
            {
                pairAddress: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                tokens: [
                    {
                        tokenID: 'WREWA-123456',
                        nonce: 0,
                        amount: firstTokenAmount,
                    },
                    {
                        tokenID: 'MOA-123456',
                        nonce: 0,
                        amount: secondTokenAmount,
                    },
                ],
                tolerance: 0.01,
            },
        );
        expect(addLiquidityTransaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: senderAddress,
            sender: senderAddress,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.addLiquidity,
            data: encodeTransactionData(
                `MultiDCDTNFTTransfer@${Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32()}@02@WREWA-123456@@10000000000000000000@MOA-123456@@9000000000000000000@addInitialLiquidity`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
        });
    });

    it('should get add liquidity transaction', async () => {
        const firstTokenAmount = '10';
        const secondTokenAmount = '9';

        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const addLiquidityTransaction = await service.addLiquidity(
            'drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            {
                pairAddress: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                tokens: [
                    {
                        tokenID: 'MOA-123456',
                        nonce: 0,
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

        expect(addLiquidityTransaction).toEqual({
            nonce: 0,
            value: '0',
            receiver:
                'drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            sender: 'drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.addLiquidity,
            data: encodeTransactionData(
                `MultiDCDTNFTTransfer@${Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32()}@2@WREWA-123456@@9@MOA-123456@@10@addLiquidity@8@9`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
        });
    });

    it('should get add liquidity batch transaction REWA first token', async () => {
        const firstTokenAmount = '10';
        const secondTokenAmount = '9';

        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const liquidityBatchTransactions = await service.addLiquidityBatch(
            senderAddress,
            {
                pairAddress: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                tokens: [
                    {
                        tokenID: 'REWA',
                        nonce: 0,
                        amount: firstTokenAmount,
                    },
                    {
                        tokenID: 'MOA-123456',
                        nonce: 0,
                        amount: secondTokenAmount,
                    },
                ],
                tolerance: 0.01,
            },
        );
        const [wrapRewaTransaction, addLiquidity] = liquidityBatchTransactions;

        expect(wrapRewaTransaction).toEqual({
            nonce: 0,
            value: '10',
            receiver:
                'drt1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq8axq7c',
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.wrapREWA,
            data: encodeTransactionData('wrapRewa'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
        expect(addLiquidity).toEqual({
            nonce: 0,
            value: '0',
            receiver: senderAddress,
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.addLiquidity,
            data: encodeTransactionData(
                `MultiDCDTNFTTransfer@${Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32()}@02@WREWA-123456@@10@MOA-123456@@09@addLiquidity@09@08`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get add liquidity batch transaction REWA second token', async () => {
        const firstTokenAmount = '10';
        const secondTokenAmount = '9';

        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const liquidityBatchTransactions = await service.addLiquidityBatch(
            senderAddress,
            {
                pairAddress: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                tokens: [
                    {
                        tokenID: 'MOA-123456',
                        nonce: 0,
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

        const [wrapRewaTransaction, addLiquidity] = liquidityBatchTransactions;

        expect(wrapRewaTransaction).toEqual({
            nonce: 0,
            value: secondTokenAmount,
            receiver:
                'drt1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq8axq7c',
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.wrapREWA,
            data: encodeTransactionData('wrapRewa'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
        expect(addLiquidity).toEqual({
            nonce: 0,
            value: '0',
            receiver: senderAddress,
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.addLiquidity,
            data: encodeTransactionData(
                `MultiDCDTNFTTransfer@${Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32()}@02@WREWA-123456@@09@MOA-123456@@10@addLiquidity@08@09`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get remove liquidity transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transactions = await service.removeLiquidity(senderAddress, {
            pairAddress: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            liquidity: '10',
            liquidityTokenID: 'REWA',
            tolerance: 0.01,
        });

        expect(transactions).toEqual([
            {
                nonce: 0,
                value: '0',
                receiver: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                sender: senderAddress,
                receiverUsername: undefined,
                senderUsername: undefined,
                gasPrice: 1000000000,
                gasLimit: gasConfig.pairs.removeLiquidity,
                data: encodeTransactionData(
                    'DCDTTransfer@1162300484@10@removeLiquidity@09@9900',
                ),
                chainID: drtConfig.chainID,
                version: 2,
                options: undefined,
                signature: undefined,
                guardian: undefined,
                guardianSignature: undefined,
            },
            {
                nonce: 0,
                value: '0',
                receiver:
                    'drt1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq8axq7c',
                sender: senderAddress,
                receiverUsername: undefined,
                senderUsername: undefined,
                gasPrice: 1000000000,
                gasLimit: gasConfig.wrapREWA,
                data: encodeTransactionData(
                    'DCDTTransfer@WREWA-123456@09@unwrapRewa',
                ),
                chainID: drtConfig.chainID,
                version: 2,
                options: undefined,
                signature: undefined,
                guardian: undefined,
                guardianSignature: undefined,
            },
        ]);
    });

    it('should get swap tokens fixed input transaction + wrap tx', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transactions = await service.swapTokensFixedInput(senderAddress, {
            pairAddress: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            tokenInID: 'REWA',
            tokenOutID: 'MOA-123456',
            amountIn: '5',
            amountOut: '5',
            tolerance: 0.01,
        });

        expect(transactions).toEqual({
            chainID: 'T',
            data: 'Y29tcG9zZVRhc2tzQDAwMDAwMDBhNGQ0NTU4MmQzMTMyMzMzNDM1MzYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwNEBAQDAyQDAwMDAwMDE0NzM3NzYxNzA1NDZmNmI2NTZlNzM0NjY5Nzg2NTY0NDk2ZTcwNzU3NDAwMDAwMDBhNGQ0NTU4MmQzMTMyMzMzNDM1MzYwMDAwMDAwMTA0',
            gasLimit: 40200000,
            gasPrice: 1000000000,
            guardian: undefined,
            guardianSignature: undefined,
            nonce: 0,
            options: undefined,
            receiver: Address.Zero().bech32(),
            receiverUsername: undefined,
            sender: senderAddress,
            senderUsername: undefined,
            signature: undefined,
            value: '5',
            version: 2,
        });
    });

    it('should get swap tokens fixed output transaction + unwrap tx', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.swapTokensFixedOutput(senderAddress, {
            pairAddress: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            tokenInID: 'MOA-123456',
            tokenOutID: 'REWA',
            amountIn: '5',
            amountOut: '5',
        });

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.Zero().bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: 40200000,
            data: 'RVNEVFRyYW5zZmVyQDRkNDU1ODJkMzEzMjMzMzQzNTM2QDA1QDYzNmY2ZDcwNmY3MzY1NTQ2MTczNmI3M0AwMDAwMDAwNDQ1NDc0YzQ0MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDVAMDJAMDAwMDAwMTU3Mzc3NjE3MDU0NmY2YjY1NmU3MzQ2Njk3ODY1NjQ0Zjc1NzQ3MDc1NzQwMDAwMDAwYzU3NDU0NzRjNDQyZDMxMzIzMzM0MzUzNjAwMDAwMDAxMDVAMDFA',
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should validate tokens', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transactions = await service.validateTokens(
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            [
                new InputTokenModel({ tokenID: 'MOA-123456' }),
                new InputTokenModel({ tokenID: 'REWA' }),
            ],
        );

        expect(transactions).toEqual([
            {
                tokenID: 'WREWA-123456',
                amount: undefined,
                nonce: undefined,
            },
            { tokenID: 'MOA-123456' },
        ]);

        try {
            await service.validateTokens(
                Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                [
                    new InputTokenModel({ tokenID: 'MOA-123456', nonce: 1 }),
                    new InputTokenModel({ tokenID: 'REWA' }),
                ],
            );
        } catch (error) {
            expect(error).toEqual(new Error('Only DCDT tokens allowed!'));
        }

        try {
            await service.validateTokens(
                Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000012',
                ).bech32(),
                [
                    new InputTokenModel({ tokenID: 'WREWA-123456' }),
                    new InputTokenModel({ tokenID: 'REWA' }),
                ],
            );
        } catch (error) {
            expect(error).toEqual(new Error('invalid tokens received'));
        }
    });

    it('should get add to whitelist transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.whitelist(senderAddress, {
            pairAddress: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            address: Address.Zero().bech32(),
        });

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.whitelist,
            data: encodeTransactionData(
                'whitelist@drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get remove from whitelist transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.removeWhitelist(senderAddress, {
            pairAddress: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            address: Address.Zero().bech32(),
        });

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.removeWhitelist,
            data: encodeTransactionData(
                'removeWhitelist@drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get add trusted swap pair transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.addTrustedSwapPair(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            Address.Zero().bech32(),
            'WREWA-123456',
            'MOA-123456',
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.addTrustedSwapPair,
            data: encodeTransactionData(
                'addTrustedSwapPair@drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z@WREWA-123456@MOA-123456',
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get remove trusted swap pair transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.removeTrustedSwapPair(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            'WREWA-123456',
            'MOA-123456',
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.removeTrustedSwapPair,
            data: encodeTransactionData(
                'removeTrustedSwapPair@WREWA-123456@MOA-123456',
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get pause transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.pause(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.pause,
            data: encodeTransactionData('pause'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get resume transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.resume(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.resume,
            data: encodeTransactionData('resume'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get set state active no swaps transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setStateActiveNoSwaps(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.setStateActiveNoSwaps,
            data: encodeTransactionData('setStateActiveNoSwaps'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get set fee percents transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setFeePercents(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            3,
            5,
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.setFeePercents,
            data: encodeTransactionData('setFeePercents@03@05'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get set locking deadline epoch transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setLockingDeadlineEpoch(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            1000,
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.setLockingDeadlineEpoch,
            data: encodeTransactionData('setLockingDeadlineEpoch@1000'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get set unlocking epoch transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setUnlockEpoch(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            1005,
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: gasConfig.pairs.admin.setUnlockEpoch,
            data: encodeTransactionData('setUnlockEpoch@1005'),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get set locking SC address transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setLockingScAddress(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            Address.Zero().bech32(),
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: 200000000,
            data: encodeTransactionData(
                'setLockingScAddress@drt1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq85hk5z',
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });

    it('should get setup fees collector transaction', async () => {
        const service = module.get<PairTransactionService>(
            PairTransactionService,
        );

        const transaction = await service.setupFeesCollector(
            senderAddress,
            Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
        );

        expect(transaction).toEqual({
            nonce: 0,
            value: '0',
            receiver: Address.fromHex(
                '0000000000000000000000000000000000000000000000000000000000000012',
            ).bech32(),
            sender: senderAddress,
            receiverUsername: undefined,
            senderUsername: undefined,
            gasPrice: 1000000000,
            gasLimit: 10000000,
            data: encodeTransactionData(
                `setupFeesCollector@drt1qqqqqqqqqqqqqpgqagq2v9exkrn3wnauq3lw4xcetwsmgmwjd8ss0hz4aw@50000`,
            ),
            chainID: drtConfig.chainID,
            version: 2,
            options: undefined,
            signature: undefined,
            guardian: undefined,
            guardianSignature: undefined,
        });
    });
});
