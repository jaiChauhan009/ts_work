import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionModel } from '../../models/transaction.model';
import { DcdtToken } from 'src/modules/tokens/models/dcdtToken.model';
import { WrapModel } from './models/wrapping.model';
import { WrapService } from './services/wrap.service';
import { WrapTransactionsService } from './services/wrap.transactions.service';
import { JwtOrNativeAuthGuard } from '../auth/jwt.or.native.auth.guard';
import { AuthUser } from '../auth/auth.user';
import { UserAuthResult } from '../auth/user.auth.result';

@Resolver(() => WrapModel)
export class WrapResolver {
    constructor(
        private wrapService: WrapService,
        private transactionService: WrapTransactionsService,
    ) {}

    @ResolveField()
    async wrappedToken(): Promise<DcdtToken> {
        return this.wrapService.wrappedRewaToken();
    }

    @Query(() => [WrapModel])
    async wrappingInfo(): Promise<WrapModel[]> {
        return this.wrapService.getWrappingInfo();
    }

    @UseGuards(JwtOrNativeAuthGuard)
    @Query(() => TransactionModel)
    async wrapRewa(
        @Args('amount') amount: string,
        @AuthUser() user: UserAuthResult,
    ): Promise<TransactionModel> {
        return this.transactionService.wrapRewa(user.address, amount);
    }

    @UseGuards(JwtOrNativeAuthGuard)
    @Query(() => TransactionModel)
    async unwrapRewa(
        @Args('amount') amount: string,
        @AuthUser() user: UserAuthResult,
    ): Promise<TransactionModel> {
        return this.transactionService.unwrapRewa(user.address, amount);
    }
}
