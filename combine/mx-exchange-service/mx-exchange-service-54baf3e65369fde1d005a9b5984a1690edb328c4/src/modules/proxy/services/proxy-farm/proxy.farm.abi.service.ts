import { Injectable } from '@nestjs/common';
import { Interaction } from '@terradharitri/sdk-core/out/smartcontracts/interaction';
import { MXProxyService } from '../../../../services/dharitri-communication/drt.proxy.service';
import { GenericAbiService } from 'src/services/generics/generic.abi.service';
import { ErrorLoggerAsync } from '@terradharitri/sdk-nestjs-common';
import { GetOrSetCache } from 'src/helpers/decorators/caching.decorator';
import { Constants } from '@terradharitri/sdk-nestjs-common';
import { AddressValue } from '@terradharitri/sdk-core/out';
import { CacheTtlInfo } from 'src/services/caching/cache.ttl.info';
import { IProxyFarmAbiService } from '../interfaces';

@Injectable()
export class ProxyFarmAbiService
    extends GenericAbiService
    implements IProxyFarmAbiService
{
    constructor(protected readonly drtProxy: MXProxyService) {
        super(drtProxy);
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxyFarm',
        remoteTtl: CacheTtlInfo.TokenID.remoteTtl,
        localTtl: CacheTtlInfo.TokenID.localTtl,
    })
    async wrappedFarmTokenID(proxyAddress: string): Promise<string> {
        return this.getWrappedFarmTokenIDRaw(proxyAddress);
    }

    async getWrappedFarmTokenIDRaw(proxyAddress: string): Promise<string> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );
        const interaction: Interaction =
            contract.methodsExplicit.getWrappedFarmTokenId();
        const response = await this.getGenericData(interaction);
        return response.firstValue.valueOf().toString();
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxyFarm',
        remoteTtl: Constants.oneHour(),
    })
    async intermediatedFarms(proxyAddress: string): Promise<string[]> {
        return this.getIntermediatedFarmsRaw(proxyAddress);
    }

    async getIntermediatedFarmsRaw(proxyAddress: string): Promise<string[]> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );

        const interaction: Interaction =
            contract.methodsExplicit.getIntermediatedFarms();
        const response = await this.getGenericData(interaction);
        return response.firstValue
            .valueOf()
            .map((farmAddress: AddressValue) => {
                return farmAddress.valueOf().toString();
            });
    }
}
