import { Module } from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from 'src/city/city.entity';
import { SupermarketEntity } from 'src/supermarket/supermarket.entity';

@Module({
  providers: [CitySupermarketService],
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
})
export class CitySupermarketModule {}
