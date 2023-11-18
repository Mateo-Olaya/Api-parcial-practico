/* eslint-disable prettier/prettier */
import { CityEntity } from 'src/city/city.entity/city.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

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
  @JoinTable()
  cities: CityEntity[];
}
