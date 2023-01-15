import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import * as Joi from 'joi';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FashionModule } from './fashion/fashion.module';
import { Fashion } from 'src/fashion/entities/fashion.entity';
import { AppController } from 'src/app.controller';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { FashionCategory } from 'src/fashion/entities/fashion.entity copy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true',
      logging: process.env.NODE_ENV === 'dev',
      entities: [User, Fashion, FashionCategory],
    }),
    UsersModule,
    AuthModule,
    FashionModule,
    CloudflareModule.forRoot({
      apiToken: process.env.CLOUDFLARE_API_TOKEN,
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH,
      imageDeliveryURL: process.env.CLOUDFLARE_IMAGE_DELIVERY_URL,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
