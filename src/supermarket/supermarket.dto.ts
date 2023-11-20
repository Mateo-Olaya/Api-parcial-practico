/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';
export class SupermarketDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly latitude: string;
 
 @IsString()
 @IsNotEmpty()
 readonly longitude: string;

 @IsString()
 @IsNotEmpty()
 readonly website: string;

}
