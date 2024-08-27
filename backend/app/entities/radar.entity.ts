import { Entity, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";


@Entity()
export class Radar extends BaseEntity {
    @Column()
    name: string;
    
    @Column()
    type: "search" | "sector";

    @Column('jsonb')
    position: {
        x: number;
        y: number;
        z: number;
    };

    @Column({ type: 'double precision' })
    minElevationAngle: number;

    @Column({ type: 'double precision' })
    maxElevationAngle: number;

    @Column()
    maxDistance: number;

    @Column({ type: 'double precision', nullable: true })
    sweepSpeed?: number;

    @Column({ type: 'double precision', nullable: true })
    azimuthAngle?: number;

    @Column({ type: 'double precision', nullable: true })
    viewAngle?: number;

    @ManyToOne(() => Mission, missionData => missionData.radars)
    mission: Mission;
}