import { Entity, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";
import { Target } from "./target.entity";

@Entity()
export class MissionTarget extends BaseEntity {
    @ManyToOne(() => Target, target => target.missionTargets)
    target: Target;
    
    @Column("jsonb")
    waypoints: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        speed: number;
    }[];

    @ManyToOne(() => Mission, missionData => missionData.targets)
    mission: Mission;
}