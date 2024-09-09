import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Mission } from "./mission.entity";

@Entity()
export class MissionMap extends BaseEntity {
    @Column()
    name: string;

    @Column()
    filename: string;
    
    @Column()
    size: number

    @OneToMany(() => Mission, target => target.map)
    missions: Mission[];

}