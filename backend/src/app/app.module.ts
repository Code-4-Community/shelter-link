import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDbService } from '../dynamodb';
import { ShelterModule } from '../shelter/shelter.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ShelterModule, UserModule],
  controllers: [AppController],
  providers: [AppService, DynamoDbService],
})
export class AppModule {}
