import { Entity, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Target extends BaseEntity {
    @Column()
    name: string;
    
    @Column({ type: 'double precision' })
    rcs: number;

    @Column({ type: 'double precision' })
    temperature: number;

    @Column({ type: 'double precision' })
    size: number;

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