import { Module } from '@nestjs/common';
import { MXCommunicationModule } from '../dharitri-communication/drt.communication.module';
import { ContextGetterService } from './context.getter.service';

@Module({
    imports: [MXCommunicationModule],
    providers: [ContextGetterService],
    exports: [ContextGetterService],
})
export class ContextModule {}
