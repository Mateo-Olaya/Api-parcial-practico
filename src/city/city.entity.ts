/* eslint-disable prettier/prettier */
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class CityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    country: string;
  
    @Column()
    habitants: number;

    @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
    @JoinTable()
    supermarkets: SupermarketEntity[];

}
