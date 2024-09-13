import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Mission } from "./mission.entity";

@Entity()
export class MissionAAPosition extends BaseEntity {
    @Column("jsonb")
    position: {
        x: number;
        y: number;
        z: number;
    };

    @ManyToOne(() => Mission, missionData => missionData.aaPositions,  {  onDelete: 'CASCADE' })
    mission: Mission;
}