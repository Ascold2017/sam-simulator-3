import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { MissionTarget } from "./missionTarget.entity";
import { BaseEntity } from "./base.entity";
import { MissionMap } from "./missionMap.entity"
import { MissionAAPosition } from "./missionAAPosition";

@Entity()
export class Mission extends BaseEntity {
    @Column()
    name: string;

    @ManyToOne(() => MissionMap, map => map.missions)
    map: MissionMap;

    @OneToMany(() => MissionTarget, target => target.mission)
    targets: MissionTarget[];

    @OneToMany(() => MissionAAPosition, position => position.mission)
    aaPositions: MissionAAPosition[];
}