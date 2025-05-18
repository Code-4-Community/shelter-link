import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDbService } from '../dynamodb';
import { ShelterModule } from '../shelter/shelter.module';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  imports: [ShelterModule, UserModule, EventModule],
  controllers: [AppController],
  providers: [AppService, DynamoDbService, {
    provide: DynamoDBClient,
    useFactory: () =>
      new DynamoDBClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      }),
  },],
})
export class AppModule {}
