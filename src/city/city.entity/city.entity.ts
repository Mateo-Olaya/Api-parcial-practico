/* eslint-disable prettier/prettier */
import { SupermarketEntity } from 'src/supermarket/supermarket.entity/supermarket.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

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
    supermarkets: SupermarketEntity[];

}
