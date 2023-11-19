/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { SupermarketEntity } from 'src/supermarket/supermarket.entity';
import { CityEntity } from 'src/city/city.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let supermarketRepository: Repository<SupermarketEntity>;
  let cityRepository: Repository<CityEntity>;
  let supermarket: SupermarketEntity;
  let cityList: CityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    supermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cityRepository.clear();
    supermarketRepository.clear();

    cityList = [];
    for (let i = 0; i < 5; i++) {
      const city: CityEntity = await cityRepository.save({
        name: faker.location.city(),
        country: "Argentina",
        habitants: faker.number.int(),
      })
      cityList.push(city);
    }

    supermarket = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.string.alphanumeric(),
      longitude: faker.string.alphanumeric(),
      website: faker.internet.url(),
      cities: cityList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCityToSupermarket should add a city to a supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.string.alphanumeric(),
      longitude: faker.string.alphanumeric(),
      website: faker.internet.url(),
    })

    const result: SupermarketEntity = await service.addCityToSupermarket(newSupermarket.id, newCity.id);

    expect(result.cities.length).toBe(1);
    expect(result.cities[0]).not.toBeNull();
    expect(result.cities[0].name).toBe(newCity.name)
    expect(result.cities[0].country).toBe(newCity.country)
    expect(result.cities[0].habitants).toBe(newCity.habitants)
  });

  it('addCityToSupermarket should thrown an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      latitude: faker.string.alphanumeric(),
      longitude: faker.string.alphanumeric(),
      website: faker.internet.url(),
    })

    await expect(() => service.addCityToSupermarket(newSupermarket.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('addCityToSupermarket should throw an exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    await expect(() => service.addCityToSupermarket("0", newCity.id)).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('findCityFromSupermarket should return a city from a supermarket', async () => {
    const city: CityEntity = cityList[0];
    const storedCity: CityEntity = await service.findCityFromSupermarket(supermarket.id, city.id,)
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toBe(city.name);
    expect(storedCity.country).toBe(city.country);
    expect(storedCity.habitants).toBe(city.habitants);
  });

  it('findCityFromSupermarket should throw an exception for an invalid city', async () => {
    await expect(() => service.findCityFromSupermarket(supermarket.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findCityFromSupermarket should throw an exception for an invalid supermarket', async () => {
    const city: CityEntity = cityList[0];
    await expect(() => service.findCityFromSupermarket("0", city.id)).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('findCityFromSupermarket should throw an exception for a city not associated to the supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    await expect(() => service.findCityFromSupermarket(supermarket.id, newCity.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the supermarket");
  });

  it('findCitiesFromSupermarket should return all cities from a supermarket', async () => {
    const cities: CityEntity[] = await service.findCitiesFromSupermarket(supermarket.id);
    expect(cities.length).toBe(5)
  });

  it('findCitiesFromSupermarket should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findCitiesFromSupermarket("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('updateCitiesFromSupermarket should update the airports from a supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    const updatedSupermarket: SupermarketEntity = await service.updateCitiesFromSupermarket(supermarket.id, [newCity]);
    expect(updatedSupermarket.cities.length).toBe(1);

    expect(updatedSupermarket.cities[0].name).toBe(newCity.name);
    expect(updatedSupermarket.cities[0].country).toBe(newCity.country);
    expect(updatedSupermarket.cities[0].habitants).toBe(newCity.habitants);
  });

  it('updateCitiesFromSupermarket should throw an exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    await expect(() => service.updateCitiesFromSupermarket("0", [newCity])).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('updateCitiesFromSupermarket should throw an exception for an invalid city', async () => {
    const newCity: CityEntity = cityList[0];
    newCity.id = "0";

    await expect(() => service.updateCitiesFromSupermarket(supermarket.id, [newCity])).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteCityFromSupermarket should remove a city from a supermarket', async () => {
    const city: CityEntity = cityList[0];

    await service.deleteCityFromSupermarket(supermarket.id, city.id);

    const storedSupermarket: SupermarketEntity = await supermarketRepository.findOne({ where: { id: supermarket.id }, relations: ["cities"] });
    const deletedCity: CityEntity = storedSupermarket.cities.find(a => a.id === city.id);

    expect(deletedCity).toBeUndefined();

  });

  it('deleteCityFromSupermarket should thrown an exception for an invalid city', async () => {
    await expect(() => service.deleteCityFromSupermarket(supermarket.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteCityFromSupermarket should thrown an exception for an invalid supermarket', async () => {
    const city: CityEntity = cityList[0];
    await expect(() => service.deleteCityFromSupermarket("0", city.id)).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('deleteCityFromSupermarket should thrown an exception for an non asocciated city', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: "Argentina",
      habitants: faker.number.int(),
    });

    await expect(() => service.deleteCityFromSupermarket(supermarket.id, newCity.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the supermarket");
  });


});
