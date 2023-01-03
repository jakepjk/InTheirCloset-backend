import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CloudflareOptions } from 'src/cloudflare/cloudflare.interface';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { CloudflareController } from './cloudflare.controller';

@Module({
  imports: [HttpModule],
  controllers: [CloudflareController],
})
@Global()
export class CloudflareModule {
  static forRoot(options: CloudflareOptions): DynamicModule {
    return {
      module: CloudflareModule,
      providers: [
        CloudflareService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [CloudflareService],
    };
  }
}
