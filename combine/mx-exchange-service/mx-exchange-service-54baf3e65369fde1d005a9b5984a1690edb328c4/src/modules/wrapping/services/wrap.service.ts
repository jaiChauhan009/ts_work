import { Injectable } from '@nestjs/common';
import { scAddress } from '../../../config';
import { WrapModel } from '../models/wrapping.model';
import { WrapAbiService } from './wrap.abi.service';
import { DcdtToken } from '../../tokens/models/dcdtToken.model';
import { TokenService } from 'src/modules/tokens/services/token.service';

@Injectable()
export class WrapService {
    constructor(
        private wrapAbi: WrapAbiService,
        private readonly tokenService: TokenService,
    ) {}

    async getWrappingInfo(): Promise<WrapModel[]> {
        return [
            new WrapModel({
                address: scAddress.wrappingAddress.get('shardID-0'),
                shard: 0,
            }),
            new WrapModel({
                address: scAddress.wrappingAddress.get('shardID-1'),
                shard: 1,
            }),
            new WrapModel({
                address: scAddress.wrappingAddress.get('shardID-2'),
                shard: 2,
            }),
        ];
    }

    async wrappedRewaToken(): Promise<DcdtToken> {
        const wrappedRewaTokenID = await this.wrapAbi.wrappedRewaTokenID();
        return this.tokenService.tokenMetadata(wrappedRewaTokenID);
    }
}
