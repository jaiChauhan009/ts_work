import { Module } from "@nestjs/common";
import { NftMediaModule } from "src/queue.worker/nft.worker/queue/job-services/media/nft.media.module";
import { AccountModule } from "./accounts/account.module";
import { BlockModule } from "./blocks/block.module";
import { BlsModule } from "./bls/bls.module";
import { CollectionModule } from "./collections/collection.module";
import { DappConfigModule } from "./dapp-config/dapp.config.module";
import { DelegationLegacyModule } from "./delegation.legacy/delegation.legacy.module";
import { DelegationModule } from "./delegation/delegation.module";
import { DcdtModule } from "./dcdt/dcdt.module";
import { IdentitiesModule } from "./identities/identities.module";
import { KeysModule } from "./keys/keys.module";
import { NftMarketplaceModule } from "./marketplace/nft.marketplace.module";
import { MoaModule } from "./moa/moa.module";
import { MiniBlockModule } from "./miniblocks/miniblock.module";
import { NetworkModule } from "./network/network.module";
import { NftModule } from "./nfts/nft.module";
import { TagModule } from "./nfttags/tag.module";
import { NodeModule } from "./nodes/node.module";
import { ProcessNftsModule } from "./process-nfts/process.nfts.module";
import { ProviderModule } from "./providers/provider.module";
import { RoundModule } from "./rounds/round.module";
import { SmartContractResultModule } from "./sc-results/scresult.module";
import { ShardModule } from "./shards/shard.module";
import { StakeModule } from "./stake/stake.module";
import { TokenModule } from "./tokens/token.module";
import { TransactionsBatchModule } from "./transactions.batch/transactions.batch.module";
import { TransactionActionModule } from "./transactions/transaction-action/transaction.action.module";
import { TransactionModule } from "./transactions/transaction.module";
import { TransferModule } from "./transfers/transfer.module";
import { UsernameModule } from "./usernames/username.module";
import { VmQueryModule } from "./vm.query/vm.query.module";
import { WaitingListModule } from "./waiting-list/waiting.list.module";
import { WebsocketModule } from "./websocket/websocket.module";
import { PoolModule } from "./pool/pool.module";
import { TpsModule } from "./tps/tps.module";
import { ApplicationModule } from "./applications/application.module";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [
    AccountModule,
    BlockModule,
    CollectionModule,
    DelegationModule,
    DelegationLegacyModule,
    IdentitiesModule,
    KeysModule,
    MiniBlockModule,
    NetworkModule,
    NftModule,
    NftMediaModule,
    TagModule,
    NodeModule,
    ProviderModule,
    RoundModule,
    SmartContractResultModule,
    ShardModule,
    StakeModule,
    TokenModule,
    RoundModule,
    TransactionModule,
    UsernameModule,
    VmQueryModule,
    WaitingListModule,
    DcdtModule,
    BlsModule,
    DappConfigModule,
    TransferModule,
    PoolModule,
    TransactionActionModule,
    WebsocketModule,
    MoaModule.forRoot(),
    ProcessNftsModule,
    NftMarketplaceModule,
    TransactionsBatchModule,
    TpsModule,
    ApplicationModule,
    EventsModule,
  ],
  exports: [
    AccountModule, CollectionModule, BlockModule, DelegationModule, DelegationLegacyModule, IdentitiesModule, KeysModule,
    MiniBlockModule, NetworkModule, NftModule, NftMediaModule, TagModule, NodeModule, ProviderModule,
    RoundModule, SmartContractResultModule, ShardModule, StakeModule, TokenModule, RoundModule, TransactionModule, UsernameModule, VmQueryModule,
    WaitingListModule, DcdtModule, BlsModule, DappConfigModule, TransferModule, PoolModule, TransactionActionModule, WebsocketModule, MoaModule,
    ProcessNftsModule, NftMarketplaceModule, TransactionsBatchModule, TpsModule, ApplicationModule, EventsModule,
  ],
})
export class EndpointsServicesModule { }
