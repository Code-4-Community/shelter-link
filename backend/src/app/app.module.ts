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

// import { Module } from '@nestjs/common';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'password',
//       database: 'bagly',
//       entities: [],
//       synchronize: process.env.NODE_ENV !== 'production',
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
