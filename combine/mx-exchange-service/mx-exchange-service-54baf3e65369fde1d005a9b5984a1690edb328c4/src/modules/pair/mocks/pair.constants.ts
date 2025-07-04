import { Address } from '@terradharitri/sdk-core/out';
import { scAddress } from 'src/config';
import { AssetsModel } from 'src/modules/tokens/models/assets.model';
import { DcdtToken } from 'src/modules/tokens/models/dcdtToken.model';
import { RolesModel } from 'src/modules/tokens/models/roles.model';

export const Tokens = (tokenID: string): DcdtToken => {
    switch (tokenID) {
        case 'WREWA-123456':
            return new DcdtToken({
                identifier: 'WREWA-123456',
                ticker: 'WREWA',
                name: 'WrappedRewa',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                supply: '1000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Core',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                derivedREWA: '1',
                roles: new RolesModel(),
            });
        case 'MOA-123456':
            return new DcdtToken({
                identifier: 'MOA-123456',
                name: 'MOA',
                ticker: 'MOA',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                supply: '2000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Ecosystem',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '0.01',
                roles: new RolesModel(),
            });
        case 'USDC-123456':
            return new DcdtToken({
                identifier: 'USDC-123456',
                name: 'CircleUSD',
                ticker: 'USDC',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                supply: '1000000000000',
                decimals: 6,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Core',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            });
        case 'USDT-123456':
            return new DcdtToken({
                identifier: 'USDT-123456',
                name: 'TetherUSD',
                ticker: 'USDT',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                supply: '1000000000000',
                decimals: 6,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Core',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            });
        case 'TOK4-123456':
            return new DcdtToken({
                identifier: 'TOK4-123456',
                name: 'Token4',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                ticker: 'TOK4',
                supply: '1000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Community',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
            });
        case 'TOK5-123456':
            return new DcdtToken({
                identifier: 'TOK5-123456',
                name: 'Token5',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                ticker: 'TOK5',
                supply: '1000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Experimental',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
            });
        case 'TOK6-123456':
            return new DcdtToken({
                identifier: 'TOK6-123456',
                name: 'Token6',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000001',
                ).bech32(),
                ticker: 'TOK6',
                supply: '1000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: 'Experimental',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
            });
        case 'REWAUSDCLP-abcdef':
            return new DcdtToken({
                identifier: 'REWAUSDCLP-abcdef',
                name: 'REWAUSDCLPToken',
                owner: scAddress.routerAddress,
                ticker: 'REWAUSDCLP',
                supply: '1000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                type: '',
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            });
        case 'REWAMOALP-abcdef':
            return new DcdtToken({
                identifier: 'REWAMOALP-abcdef',
                name: 'REWAMOALPToken',
                ticker: 'REWAMOALP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '0',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
            });
        case 'REWATOK4LP-abcdef':
            return new DcdtToken({
                identifier: 'REWATOK4LP-abcdef',
                name: 'REWATOK4LP',
                ticker: 'REWATOK4LP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'REWATOK5LP-abcdef':
            return new DcdtToken({
                identifier: 'REWATOK5LP-abcdef',
                name: 'REWATOK5LP',
                ticker: 'REWATOK5LP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'TOK5TOK6LP-abcdef':
            return new DcdtToken({
                identifier: 'TOK5TOK6LP-abcdef',
                name: 'TOK5TOK6LP',
                ticker: 'TOK5TOK6LP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'TOK5USDCLP-abcdef':
            return new DcdtToken({
                identifier: 'TOK5USDCLP-abcdef',
                name: 'TOK5USDCLP',
                ticker: 'TOK5USDCLP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'TOK5USDTLP-abcdef':
            return new DcdtToken({
                identifier: 'TOK5USDTLP-abcdef',
                name: 'TOK5USDTLP',
                ticker: 'TOK5USDTLP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'REWAUSDTLP-abcdef':
            return new DcdtToken({
                identifier: 'REWAUSDTLP-abcdef',
                name: 'REWAUSDTLP',
                ticker: 'REWAUSDTLP',
                type: 'FungibleDCDT',
                owner: scAddress.routerAddress,
                supply: '1000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '900000000000000000000000',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '10',
                roles: new RolesModel(),
            });
        case 'REWAMOAFL-abcdef':
            return {
                identifier: 'REWAMOAFL-abcdef',
                name: 'REWAMOALPStaked',
                ticker: 'REWAMOAFL',
                type: 'FungibleDCDT',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000021',
                ).bech32(),
                derivedREWA: '0',
                supply: '10000000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            };
        case 'REWAMOAF-abcdef':
            return {
                identifier: 'REWAMOAF-abcdef',
                name: 'REWAMOALPStaked',
                ticker: 'REWAMOAF',
                type: 'FungibleDCDT',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000022',
                ).bech32(),
                derivedREWA: '0',
                supply: '10000000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            };
        case 'REWAMOAFL-bcdefg':
            return {
                identifier: 'REWAMOAFL-bcdefg',
                name: 'REWAMOALPStaked',
                ticker: 'REWAMOAFL',
                type: 'FungibleDCDT',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000023',
                ).bech32(),
                derivedREWA: '0',
                supply: '10000000000000000000000000000',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            };
        case 'REWATOK4FL-abcdef':
            return {
                identifier: 'REWATOK4FL-abcdef',
                name: 'REWATOK4LPStaked',
                ticker: 'REWATOK4FL',
                type: 'FungibleDCDT',
                owner: Address.fromHex(
                    '0000000000000000000000000000000000000000000000000000000000000024',
                ).bech32(),
                derivedREWA: '0',
                supply: '0',
                decimals: 18,
                isPaused: false,
                canUpgrade: true,
                canMint: true,
                canBurn: true,
                canChangeOwner: true,
                canPause: true,
                canFreeze: true,
                canWipe: true,
                minted: '1',
                burnt: '1',
                circulatingSupply: '1',
                accounts: 1,
                transactions: 1,
                assets: new AssetsModel(),
                initialMinted: '1',
                price: '1',
                roles: new RolesModel(),
            };
        default:
            break;
    }
};

export const pairs = [
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000012',
        ).bech32(),
        firstToken: Tokens('WREWA-123456'),
        secondToken: Tokens('MOA-123456'),
        liquidityPoolToken: Tokens('REWAMOALP-abcdef'),
        info: {
            reserves0: '1000000000000000000000',
            reserves1: '1000000000000000000000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '1000',
        firstTokenPriceUSD: '10',
        secondTokenPrice: '0.001',
        secondTokenPriceUSD: '0.01',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: true,
        tradesCount: 1000,
        hasFarms: false,
        hasDualFarms: false,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000013',
        ).bech32(),
        firstToken: Tokens('WREWA-123456'),
        secondToken: Tokens('USDC-123456'),
        liquidityPoolToken: Tokens('REWAUSDCLP-abcdef'),
        info: {
            reserves0: '1000000000000000000000',
            reserves1: '10000000000',
            totalSupply: '10000000000',
        },
        firstTokenPrice: '10',
        firstTokenPriceUSD: '10',
        secondTokenPrice: '0.1',
        secondTokenPriceUSD: '1',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: true,
        tradesCount: 1010,
        hasFarms: true,
        hasDualFarms: false,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000014',
        ).bech32(),
        firstToken: Tokens('TOK4-123456'),
        secondToken: Tokens('WREWA-123456'),
        liquidityPoolToken: Tokens('REWATOK4LP-abcdef'),
        info: {
            reserves0: '100000000000000000000000',
            reserves1: '1000000000000000000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '0.01',
        firstTokenPriceUSD: '0.1',
        secondTokenPrice: '100',
        secondTokenPriceUSD: '10',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: true,
        tradesCount: 0,
        hasFarms: true,
        hasDualFarms: false,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000015',
        ).bech32(),
        firstToken: Tokens('WREWA-123456'),
        secondToken: Tokens('TOK5-123456'),
        liquidityPoolToken: Tokens('REWATOK5LP-abcdef'),
        info: {
            reserves0: '1000000000000000000000',
            reserves1: '100000000000000000000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '100',
        firstTokenPriceUSD: '10',
        secondTokenPrice: '0.01',
        secondTokenPriceUSD: '0.1',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: false,
        tradesCount: 30,
        hasFarms: true,
        hasDualFarms: true,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000016',
        ).bech32(),
        firstToken: Tokens('TOK6-123456'),
        secondToken: Tokens('TOK5-123456'),
        liquidityPoolToken: Tokens('TOK5TOK6LP-abcdef'),
        info: {
            reserves0: '1000000000000000000000',
            reserves1: '1000000000000000000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '1',
        firstTokenPriceUSD: '0.1',
        secondTokenPrice: '1',
        secondTokenPriceUSD: '0.1',
        liquidityPoolTokenPriceUSD: '0.2',
        firstTokenLockedValueUSD: '100',
        secondTokenLockedValueUSD: '100',
        lockedValueUSD: '200',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: true,
        tradesCount: 0,
        hasFarms: false,
        hasDualFarms: false,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000017',
        ).bech32(),
        firstToken: Tokens('TOK5-123456'),
        secondToken: Tokens('USDC-123456'),
        liquidityPoolToken: Tokens('TOK5USDCLP-abcdef'),
        info: {
            reserves0: '10000000000000000000',
            reserves1: '1000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '0.1',
        firstTokenPriceUSD: '0.1',
        secondTokenPrice: '10',
        secondTokenPriceUSD: '1',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: false,
        tradesCount: 0,
        hasFarms: false,
        hasDualFarms: false,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000018',
        ).bech32(),
        firstToken: Tokens('TOK5-123456'),
        secondToken: Tokens('USDT-123456'),
        liquidityPoolToken: Tokens('TOK5USDTLP-abcdef'),
        info: {
            reserves0: '990000000000000000000000',
            reserves1: '100000000000',
            totalSupply: '1000000000000000000000',
        },
        firstTokenPrice: '0.1010101010101010101010101',
        firstTokenPriceUSD: '0.101',
        secondTokenPrice: '9.9',
        secondTokenPriceUSD: '1',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '1000',
        state: 'Active',
        feeState: false,
        tradesCount: 0,
        hasFarms: false,
        hasDualFarms: true,
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000019',
        ).bech32(),
        firstToken: Tokens('WREWA-123456'),
        secondToken: Tokens('USDT-123456'),
        liquidityPoolToken: Tokens('REWAUSDTLP-abcdef'),
        info: {
            reserves0: '1000000000000000000000',
            reserves1: '10000000000',
            totalSupply: '10000000000',
        },
        firstTokenPrice: '10',
        firstTokenPriceUSD: '10',
        secondTokenPrice: '0.1',
        secondTokenPriceUSD: '1',
        liquidityPoolTokenPriceUSD: '20',
        firstTokenLockedValueUSD: '10000',
        secondTokenLockedValueUSD: '10000',
        lockedValueUSD: '20000',
        totalFeePercent: 0.003,
        volumeUSD: '700',
        state: 'Active',
        feeState: false,
        tradesCount: 0,
        hasFarms: false,
        hasDualFarms: false,
    },
];

export async function PairsMap(): Promise<Map<string, string[]>> {
    const pairsMap: Map<string, string[]> = new Map();
    pairsMap.set('WREWA-123456', ['MOA-123456', 'USDC-123456', 'TOK4-123456']);
    pairsMap.set('MOA-123456', ['WREWA-123456']);
    pairsMap.set('USDC-123456', ['WREWA-123456']);
    pairsMap.set('TOK4-123456', ['WREWA-123456']);
    return pairsMap;
}

export const PairsData = (pairAddress: string) => {
    return pairs.find((p) => p.address === pairAddress);
};
