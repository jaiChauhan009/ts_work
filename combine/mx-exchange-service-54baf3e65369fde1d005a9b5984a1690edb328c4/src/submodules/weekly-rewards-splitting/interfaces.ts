import { DcdtTokenPayment } from '../../models/dcdtTokenPayment.model';
import {
    ClaimProgress,
    TokenDistributionModel,
} from './models/weekly-rewards-splitting.model';
import { EnergyModel } from '../../modules/energy/models/energy.model';
import { EnergyType } from '@terradharitri/sdk-exchange';

export interface IWeeklyRewardsSplittingAbiService {
    currentClaimProgress(
        scAddress: string,
        user: string,
    ): Promise<ClaimProgress>;
    userEnergyForWeek(
        scAddress: string,
        userAddress: string,
        week: number,
    ): Promise<EnergyModel>;
    lastActiveWeekForUser(
        scAddress: string,
        userAddress: string,
    ): Promise<number>;
    lastGlobalUpdateWeek(scAddress: string): Promise<number>;
    totalRewardsForWeek(
        scAddress: string,
        week: number,
    ): Promise<DcdtTokenPayment[]>;
    totalEnergyForWeek(scAddress: string, week: number): Promise<string>;
    totalLockedTokensForWeek(scAddress: string, week: number): Promise<string>;
}

export interface IWeeklyRewardsSplittingSetterService {
    currentClaimProgress(
        scAddress: string,
        userAddress: string,
        value: ClaimProgress,
    ): Promise<string>;

    userEnergyForWeek(
        scAddress: string,
        userAddress: string,
        week: number,
        value: EnergyType,
    ): Promise<string>;

    lastActiveWeekForUser(
        scAddress: string,
        userAddress: string,
        value: number,
    ): Promise<string>;

    lastGlobalUpdateWeek(scAddress: string, value: number): Promise<string>;

    totalRewardsForWeek(
        scAddress: string,
        week: number,
        value: DcdtTokenPayment[],
    ): Promise<string>;

    totalEnergyForWeek(
        scAddress: string,
        week: number,
        value: string,
    ): Promise<string>;

    totalLockedTokensForWeek(
        scAddress: string,
        week: number,
        value: string,
    ): Promise<string>;
}

export interface IWeeklyRewardsSplittingComputeService {
    computeDistribution(
        payments: DcdtTokenPayment[],
    ): Promise<TokenDistributionModel[]>;

    computeWeekAPR(scAddress: string, week: number): Promise<string>;

    userApr(
        scAddress: string,
        userAddress: string,
        week: number,
    ): Promise<string>;

    computeUserApr(
        scAddress: string,
        userAddress: string,
        week: number,
    ): Promise<string>;
}

export interface IProgressComputeService {
    advanceWeek(
        progress: ClaimProgress,
        nextWeekEnergy: EnergyType,
        epochsInWeek: number,
    ): ClaimProgress;
}
