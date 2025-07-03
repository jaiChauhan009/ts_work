import { Field, ObjectType } from '@nestjs/graphql';
import { LockedTokenAttributesModel } from 'src/modules/simple-lock/models/simple.lock.model';
import { NftToken } from './nftToken.model';

@ObjectType()
export class LockedDcdtToken extends NftToken {
    @Field(() => LockedTokenAttributesModel)
    decodedAttributes: LockedTokenAttributesModel;
}
