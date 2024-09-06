import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Mission } from "./mission.entity";

@Entity()
export class Map extends BaseEntity {
    @Column()
    name: string;

    @Column("jsonb")
    map: {
        size: number;
        data: number[][];
    };

    @OneToMany(() => Mission, target => target.map)
    missions: Mission[];

}