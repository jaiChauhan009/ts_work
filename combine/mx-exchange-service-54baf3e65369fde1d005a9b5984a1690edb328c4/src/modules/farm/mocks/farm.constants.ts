import { Address } from '@terradharitri/sdk-core/out';

export const farms = [
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000021',
        ).bech32(),
        farmedTokenID: 'MEX-123456',
        farmTokenID: 'REWAMEXFL-abcdef',
        farmingTokenID: 'REWAMEXLP-abcdef',
        farmTotalSupply: '2000000000000000000',
        farmingTokenReserve: '1500000000000000000',
        rewardsPerBlock: '1000000000000000000',
        rewardPerShare: '0',
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000031',
        ).bech32(),
        farmedTokenID: 'MEX-123456',
        farmTokenID: 'REWAMEXF-abcdef',
        farmingTokenID: 'REWAMEXLP-abcdef',
        farmTotalSupply: '1000000000000000000',
        farmingTokenReserve: '1000000000000000000',
        rewardsPerBlock: '1000000000000000000',
        rewardPerShare: '0',
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000032',
        ).bech32(),
        farmedTokenID: 'MEX-123456',
        farmTokenID: 'REWAMEXFL-bcdefg',
        farmingTokenID: 'REWAMEXLP-abcdef',
        farmTotalSupply: '1000000000000000000',
        farmingTokenReserve: '1000000000000000000',
        rewardsPerBlock: '1000000000000000000',
        rewardPerShare: '0',
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000033',
        ).bech32(),
        farmedTokenID: 'TOK4-123456',
        farmTokenID: 'REWATOK4FL-abcdef',
        farmingTokenID: 'REWATOK4LP-abcdef',
        farmTotalSupply: '1000000000000000000',
        farmingTokenReserve: '1000000000000000000',
        rewardsPerBlock: '2000000000000000000',
        rewardPerShare: '0',
    },
    {
        address: Address.fromHex(
            '0000000000000000000000000000000000000000000000000000000000000041',
        ).bech32(),
        farmedTokenID: 'MEX-123456',
        farmTokenID: 'REWAMEXFL-ghijkl',
        farmingTokenID: 'REWAMEXLP-abcdef',
        farmTotalSupply: '1000000000000000000',
        farmingTokenReserve: '1000000000000000000',
        rewardsPerBlock: '2000000000000000000',
        rewardPerShare: '0',
    },
];
