import { Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { DatabaseModule } from 'src/services/database/database.module';
import { MXCommunicationModule } from 'src/services/dharitri-communication/drt.communication.module';

@Module({
    imports: [
        MXCommunicationModule,
        DatabaseModule
    ],
    providers: [
        TokenService,
    ],
    exports: [
        TokenService,
    ],
})
export class TokenModule {}
