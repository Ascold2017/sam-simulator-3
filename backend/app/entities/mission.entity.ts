import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { MissionTarget } from "./missionTarget.entity";
import { BaseEntity } from "./base.entity";
import { Map } from "./map.entity";

@Entity()
export class Mission extends BaseEntity {
    @Column()
    name: string;

    @ManyToOne(() => Map, map => map.missions)
    map: Map;

    @OneToMany(() => MissionTarget, target => target.mission)
    targets: MissionTarget[];

    @Column("jsonb")
    aaPositions: {
        x: number;
        y: number;
        z: number;
    }[] = [];
}