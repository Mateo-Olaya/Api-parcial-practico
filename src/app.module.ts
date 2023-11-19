/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupermarketModule } from './supermarket/supermarket.module';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket/supermarket.entity';
import { CityEntity } from './city/city.entity';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';

@Module({
  imports: [SupermarketModule, CityModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'postgres',
     database: 'parcial',
     entities: [SupermarketEntity, CityEntity],
     dropSchema: true,
     synchronize: true,
     keepConnectionAlive: true,
  }),
  CitySupermarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
