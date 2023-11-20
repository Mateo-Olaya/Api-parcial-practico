/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { CityDto } from './city.dto';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityController {

    constructor(private readonly cityService: CityService) {}

    @Get()
    async findAll() {
        return await this.cityService.findAll();
    }

    @Get(':cityId')
    async findOne(@Param('cityId') cityId: string) {
        return await this.cityService.findOne(cityId);
    }

    @Post()
    async create(@Body() cityDto: CityDto) {
        const city: CityEntity = plainToInstance(CityEntity, cityDto);
        return await this.cityService.create(city);
    }

    @Put(':cityId')
    async update(@Param('cityId') cityId: string, @Body() cityDto: CityDto) {
        const city: CityEntity = plainToInstance(CityEntity, cityDto);
        return await this.cityService.update(cityId, city);
    }

    @Delete(':cityId')
    @HttpCode(204)
    async delete(@Param('cityId') cityId: string) {
        return await this.cityService.delete(cityId);
    }
}
