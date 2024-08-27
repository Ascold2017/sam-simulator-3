import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Camera extends BaseEntity {
    @Column()
    name: string;

    @Column()
    type: "tv" | "thermal";

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

    @Column({ type: 'double precision' })
    azimuthAngle: number;

    @Column({ type: 'double precision' })
    viewAngle: number;

    @ManyToOne(() => Mission, missionData => missionData.cameras)
    mission: Mission;
}