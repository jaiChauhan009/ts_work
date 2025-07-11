import { Injectable } from '@nestjs/common';
import { MXProxyService } from '../../../services/dharitri-communication/drt.proxy.service';
import { GovernanceTokenSnapshotMerkleService } from './governance.token.snapshot.merkle.service';
import { GovernanceDescriptionService } from './governance.description.service';
import { GovernanceType } from '../../../utils/governance';
import { GovernanceProposalModel, GovernanceProposalStatus } from '../models/governance.proposal.model';
import { ProposalVotes } from '../models/governance.proposal.votes.model';
import { GovernanceLKMOAProposal } from '../entities/lkmoa.proposal';
import { GovernanceEnergyAbiService } from './governance.abi.service';
import { LockedAssetGetterService } from '../../locked-asset-factory/services/locked.asset.getter.service';

@Injectable()
export class GovernanceOldEnergyAbiService extends GovernanceEnergyAbiService {
    constructor(
        protected readonly drtProxy: MXProxyService,
        protected readonly governanceMerkle: GovernanceTokenSnapshotMerkleService,
        protected readonly governanceDescription: GovernanceDescriptionService,
        private readonly lockedAssetGetter: LockedAssetGetterService,
    ) {
        super(drtProxy, governanceMerkle, governanceDescription);
        this.type = GovernanceType.OLD_ENERGY;
    }


    async energyFactoryAddress(scAddress: string): Promise<string> {
        return Promise.resolve('');
    }

    async feeTokenId(scAddress: string): Promise<string> {
        return this.lockedAssetGetter.getLockedTokenID();
    }

    async feesCollectorAddress(scAddress: string): Promise<string> {
        return Promise.resolve('');
    }

    async getAddressShardID(scAddress: string): Promise<number> {
        return Promise.resolve(1);
    }

    async minEnergyForPropose(scAddress: string): Promise<string> {
        return Promise.resolve('0');
    }

    async minFeeForPropose(scAddress: string): Promise<string> {
        return Promise.resolve('0');
    }

    async proposalRootHash(scAddress: string, proposalId: number): Promise<string> {
        return Promise.resolve('');
    }

    async proposalStatus(scAddress: string, proposalId: number): Promise<GovernanceProposalStatus> {
        return Promise.resolve(GovernanceProposalStatus.Succeeded);
    }

    async proposalVotes(scAddress: string, proposalId: number): Promise<ProposalVotes> {
        return Promise.resolve(new GovernanceLKMOAProposal().votes);
    }

    async proposals(scAddress: string): Promise<GovernanceProposalModel[]> {
        return Promise.resolve([
            new GovernanceProposalModel({
                contractAddress: scAddress,
                ...new GovernanceLKMOAProposal()
            }),
        ]);
    }

    async quorum(scAddress: string): Promise<string> {
        return Promise.resolve('');
    }

    async userVotedProposals(scAddress: string, userAddress: string): Promise<number[]> {
        return Promise.resolve([]);
    }

    async votingDelayInBlocks(scAddress: string): Promise<number> {
        return Promise.resolve(0);
    }

    async votingPeriodInBlocks(scAddress: string): Promise<number> {
        return Promise.resolve(0);
    }

    async withdrawPercentageDefeated(scAddress: string): Promise<number> {
        return Promise.resolve(0);
    }
}
