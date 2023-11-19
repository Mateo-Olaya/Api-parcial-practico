/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class CityService {

    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>
    ) { }

    async findAll(): Promise<CityEntity[]> {
        return await this.cityRepository.find({ relations: ["supermarkets"] });
    }

    async findOne(id: string): Promise<CityEntity> {
        const city: CityEntity = await this.cityRepository.findOne({ where: { id }, relations: ["supermarkets"] });
        if (!city)
            throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);

        return city;
    }

    async create(city: CityEntity): Promise<CityEntity> {

        const country = city.country;
        console.log(country);

        if (country !== "Argentina" && country !== "Ecuador" && country !== "Paraguay")
            throw new BusinessLogicException(
                'The country of the city is not valid: Must be Argentina, Ecuador or Paraguay',
                BusinessError.BAD_REQUEST,);

        return await this.cityRepository.save(city);
    }
    
    async update(id: string, city: CityEntity): Promise<CityEntity> {
        const persistedCity: CityEntity = await this.cityRepository.findOne({ where: { id } });
        if (!persistedCity)
            throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);

        const country = new String(city.country);

        if (country != "Argentina" || country != "Ecuador" || country != "Paraguay")
            throw new BusinessLogicException(
                'The name of the country where the city is located must be Argentina, Ecuador or Paraguay',
                BusinessError.BAD_REQUEST,);

        return await this.cityRepository.save({ ...persistedCity, ...city });
    }

    async delete(id: string) {
        const city: CityEntity = await this.cityRepository.findOne({where:{id}});
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.cityRepository.remove(city);
    }

}
