import { Injectable } from '@nestjs/common';
import { GenericAbiService } from '../../../services/generics/generic.abi.service';
import { MXProxyService } from '../../../services/dharitri-communication/drt.proxy.service';
import { Interaction } from '@terradharitri/sdk-core';
import { ErrorLoggerAsync } from '@terradharitri/sdk-nestjs-common';
import { GetOrSetCache } from 'src/helpers/decorators/caching.decorator';
import { CacheTtlInfo } from 'src/services/caching/cache.ttl.info';

@Injectable()
export class LockedTokenWrapperAbiService extends GenericAbiService {
    constructor(protected readonly drtProxy: MXProxyService) {
        super(drtProxy);
    }

    @ErrorLoggerAsync()
    @GetOrSetCache({
        baseKey: 'lockedTokenWrapper',
        remoteTtl: CacheTtlInfo.TokenID.remoteTtl,
        localTtl: CacheTtlInfo.TokenID.localTtl,
    })
    async wrappedTokenId(): Promise<string> {
        return this.wrappedTokenIdRaw();
    }

    async wrappedTokenIdRaw(): Promise<string> {
        const contract = await this.drtProxy.getLockedTokenWrapperContract();
        const interaction: Interaction =
            contract.methodsExplicit.getWrappedTokenId();
        const response = await this.getGenericData(interaction);
        return response.firstValue.valueOf().toString();
    }

    @ErrorLoggerAsync()
    @GetOrSetCache({
        baseKey: 'lockedTokenWrapper',
        remoteTtl: CacheTtlInfo.ContractInfo.remoteTtl,
        localTtl: CacheTtlInfo.ContractInfo.localTtl,
    })
    async energyFactoryAddress(): Promise<string> {
        return this.energyFactoryAddressRaw();
    }

    async energyFactoryAddressRaw(): Promise<string> {
        const contract = await this.drtProxy.getLockedTokenWrapperContract();
        const interaction: Interaction =
            contract.methodsExplicit.getEnergyFactoryAddress();
        const response = await this.getGenericData(interaction);
        return response.firstValue.valueOf().bech32();
    }
}
