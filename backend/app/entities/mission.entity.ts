import { Entity, Column, OneToMany } from "typeorm";
import { MissionTarget } from "./missionTarget.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Mission extends BaseEntity {
    @Column()
    name: string;

    @Column("jsonb")
    map: {
        size: number;
        data: number[][];
    };

    @OneToMany(() => MissionTarget, target => target.mission)
    targets: MissionTarget[];

    @Column("jsonb")
    aaPositions: {
        x: number;
        y: number;
        z: number;
    }[] = [];
}