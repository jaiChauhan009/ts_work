import { Injectable } from '@nestjs/common';
import { Interaction } from '@terradharitri/sdk-core/out/smartcontracts/interaction';
import { MXProxyService } from 'src/services/dharitri-communication/drt.proxy.service';
import { GenericAbiService } from 'src/services/generics/generic.abi.service';
import { ErrorLoggerAsync } from '@terradharitri/sdk-nestjs-common';
import { GetOrSetCache } from 'src/helpers/decorators/caching.decorator';
import { CacheTtlInfo } from 'src/services/caching/cache.ttl.info';
import { IProxyAbiService } from './interfaces';

@Injectable()
export class ProxyAbiService
    extends GenericAbiService
    implements IProxyAbiService
{
    constructor(protected readonly drtProxy: MXProxyService) {
        super(drtProxy);
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxy',
        remoteTtl: CacheTtlInfo.TokenID.remoteTtl,
        localTtl: CacheTtlInfo.TokenID.localTtl,
    })
    async assetTokenID(proxyAddress: string): Promise<string> {
        return this.getAssetTokenIDRaw(proxyAddress);
    }

    async getAssetTokenIDRaw(proxyAddress: string): Promise<string> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );
        const interaction: Interaction =
            contract.methodsExplicit.getAssetTokenId();
        const response = await this.getGenericData(interaction);
        return response.firstValue.valueOf().toString();
    }

    @ErrorLoggerAsync({
        logArgs: true,
    })
    @GetOrSetCache({
        baseKey: 'proxy',
        remoteTtl: CacheTtlInfo.TokenID.remoteTtl,
        localTtl: CacheTtlInfo.TokenID.localTtl,
    })
    async lockedAssetTokenID(proxyAddress: string): Promise<string[]> {
        return this.getLockedAssetTokenIDRaw(proxyAddress);
    }

    async getLockedAssetTokenIDRaw(proxyAddress: string): Promise<string[]> {
        const contract = await this.drtProxy.getProxyDexSmartContract(
            proxyAddress,
        );
        const interaction: Interaction =
            contract.methodsExplicit.getLockedAssetTokenId();
        const response = await this.getGenericData(interaction);
        return [response.firstValue.valueOf().toString()];
    }
}
