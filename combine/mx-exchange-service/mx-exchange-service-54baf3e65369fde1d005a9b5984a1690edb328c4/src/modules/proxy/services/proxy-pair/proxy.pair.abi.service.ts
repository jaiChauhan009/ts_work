import { Injectable } from '@nestjs/common';
import { Interaction } from '@terradharitri/sdk-core/out/smartcontracts/interaction';
import { MXProxyService } from 'src/services/dharitri-communication/drt.proxy.service';
import { GenericAbiService } from 'src/services/generics/generic.abi.service';
import { ErrorLoggerAsync } from '@terradharitri/sdk-nestjs-common';
import { GetOrSetCache } from 'src/helpers/decorators/caching.decorator';
import { CacheTtlInfo } from 'src/services/caching/cache.ttl.info';
import { Constants } from '@terradharitri/sdk-nestjs-common';
import { AddressValue } from '@terradharitri/sdk-core/out';
import { IProxyPairAbiService } from '../interfaces';

@Injectable()
export class ProxyPairAbiService
    extends GenericAbiService
    implements IProxyPairAbiService
{
    constructor(protected readonly drtProxy: MXProxyService) {
        super(drtProxy);
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxyPair',
        remoteTtl: CacheTtlInfo.TokenID.remoteTtl,
        localTtl: CacheTtlInfo.TokenID.localTtl,
    })
    async wrappedLpTokenID(proxyAddress: string): Promise<string> {
        return this.getWrappedLpTokenIDRaw(proxyAddress);
    }

    async getWrappedLpTokenIDRaw(proxyAddress: string): Promise<string> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );
        const interaction: Interaction =
            contract.methodsExplicit.getWrappedLpTokenId();
        const response = await this.getGenericData(interaction);
        return response.firstValue.valueOf().toString();
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxyPair',
        remoteTtl: Constants.oneHour(),
    })
    async intermediatedPairs(proxyAddress: string): Promise<string[]> {
        return this.getIntermediatedPairsRaw(proxyAddress);
    }

    async getIntermediatedPairsRaw(proxyAddress: string): Promise<string[]> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );

        const interaction: Interaction =
            contract.methodsExplicit.getIntermediatedPairs();
        const response = await this.getGenericData(interaction);
        return response.firstValue
            .valueOf()
            .map((pairAddress: AddressValue) => {
                return pairAddress.valueOf().toString();
            });
    }
}
