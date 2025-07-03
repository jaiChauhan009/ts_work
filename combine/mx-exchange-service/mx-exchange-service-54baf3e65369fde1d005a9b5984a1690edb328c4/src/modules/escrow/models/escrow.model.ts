import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { DcdtTokenPaymentModel } from 'src/modules/tokens/models/dcdt.token.payment.model';

@ObjectType()
export class EscrowModel {
    @Field()
    address: string;
    @Field()
    energyFactoryAddress: string;
    @Field()
    lockedTokenID: string;
    @Field()
    minLockEpochs: number;
    @Field()
    epochsCooldownDuration: number;

    constructor(init?: Partial<EscrowModel>) {
        Object.assign(this, init);
    }
}

@ObjectType()
export class LockedFundsModel {
    @Field(() => [DcdtTokenPaymentModel])
    funds: DcdtTokenPaymentModel[];
    @Field()
    lockedEpoch: number;

    constructor(init?: Partial<LockedFundsModel>) {
        Object.assign(this, init);
    }
}

@ObjectType()
export class ScheduledTransferModel {
    @Field()
    sender: string;
    @Field(() => LockedFundsModel)
    lockedFunds: LockedFundsModel;

    constructor(init?: Partial<ScheduledTransferModel>) {
        Object.assign(this, init);
    }
}

export enum SCPermissions {
    NONE,
    OWNER,
    ADMIN,
    PAUSE,
}

registerEnumType(SCPermissions, {
    name: 'SCPermissions',
});
