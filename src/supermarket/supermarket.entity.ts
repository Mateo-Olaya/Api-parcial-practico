/* eslint-disable prettier/prettier */
import { CityEntity } from '../city/city.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  website: string;

  @ManyToMany(() => CityEntity, city => city.supermarkets)
  cities: CityEntity[];
}
