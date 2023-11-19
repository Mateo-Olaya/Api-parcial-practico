/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from '../../supermarket/supermarket.entity';
import { CityEntity } from '../../city/city.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [SupermarketEntity, CityEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),

    TypeOrmModule.forFeature([SupermarketEntity, CityEntity]),
]
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/