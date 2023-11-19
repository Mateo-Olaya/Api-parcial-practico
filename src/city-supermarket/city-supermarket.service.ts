/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from 'src/city/city.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { SupermarketEntity } from 'src/supermarket/supermarket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitySupermarketService {
    constructor(
        @InjectRepository(SupermarketEntity)
        private readonly supermarketRepository: Repository<SupermarketEntity>,

        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>,
    ) { }

    async addCityToSupermarket(
        supermarketId: string,
        cityId: string,
    ): Promise<SupermarketEntity> {
        const city: CityEntity = await this.cityRepository.findOne({
            where: {
                id: cityId,
            },
        });
        if (!city)
            throw new BusinessLogicException(
                'The city with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {
                id: supermarketId,
            },
            relations: ['cities'],
        });

        if (!supermarket)
            throw new BusinessLogicException(
                'The supermarket with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        supermarket.cities = [...supermarket.cities, city];
        return await this.supermarketRepository.save(supermarket);
    }

    async findCitiesFromSupermarket(supermarketId: string): Promise<CityEntity[]> {
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {
                id: supermarketId,
            },
            relations: ['cities'],
        });

        if (!supermarket)
            throw new BusinessLogicException(
                'The supermarket with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        return supermarket.cities;
    }

    async findCityFromSupermarket(
        supermarketId: string,
        cityId: string,
    ): Promise<CityEntity> {
        const city: CityEntity = await this.cityRepository.findOne({
            where: {
                id: cityId,
            },
        });

        if (!city)
            throw new BusinessLogicException(
                'The city with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {
                id: supermarketId,
            },
            relations: ['cities'],
        });

        if (!supermarket)
            throw new BusinessLogicException(
                'The supermarket with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        const supermarketCity: CityEntity = supermarket.cities.find(
            (e) => e.id === city.id,
        );

        if (!supermarketCity)
            throw new BusinessLogicException(
                'The city with the given id is not associated to the supermarket',
                BusinessError.PRECONDITION_FAILED,
            );

        return supermarketCity;
    }

    async updateCitiesFromSupermarket(
        supermarketId: string,
        cities: CityEntity[],
    ): Promise<SupermarketEntity> {
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {
                id: supermarketId,
            },
            relations: ['cities'],
        });

        if (!supermarket)
            throw new BusinessLogicException(
                'The supermarket with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        for (let i = 0; i < cities.length; i++) {
            const city: CityEntity = await this.cityRepository.findOne({
                where: {
                    id: cities[i].id,
                },
            });

            if (!city)
                throw new BusinessLogicException(
                    'The city with the given id was not found',
                    BusinessError.NOT_FOUND,
                );
        }

        supermarket.cities = cities;
        return await this.supermarketRepository.save(supermarket);
    }

    async deleteCityFromSupermarket(
        supermarketId: string,
        cityId: string,
    ): Promise<SupermarketEntity> {
        const city: CityEntity = await this.cityRepository.findOne({
            where: {
                id: cityId,
            },
        });

        if (!city)
            throw new BusinessLogicException(
                'The city with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({
            where: {
                id: supermarketId,
            },
            relations: ['cities'],
        });

        if (!supermarket)
            throw new BusinessLogicException(
                'The supermarket with the given id was not found',
                BusinessError.NOT_FOUND,
            );

        const supermarketCity: CityEntity = supermarket.cities.find(
            (e) => e.id === city.id,
        );

        if (!supermarketCity)
            throw new BusinessLogicException(
                'The city with the given id is not associated to the supermarket',
                BusinessError.PRECONDITION_FAILED,
            );

        supermarket.cities = supermarket.cities.filter((e) => e.id !== city.id);
        return await this.supermarketRepository.save(supermarket);
    }

}
