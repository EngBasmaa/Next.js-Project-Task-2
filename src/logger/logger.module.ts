import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './custom.logger';

@Global()
@Module({
    providers: [CustomLogger],
    exports: [CustomLogger],
})
export class LoggerModule { }
