import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class AA extends BaseEntity {
    @Column()
    name: string;

    @Column("jsonb")
    position: {
        x: number;
        y: number;
        z: number;
    };

    @Column()
    type: 'active-missile' | 'gun'

    @Column({ type: 'double precision' })
    ammoMaxRange: number;

    @Column({ type: 'double precision' })
    ammoVelocity: number;

    @ManyToOne(() => Mission, missionData => missionData.aas)
    mission: Mission;
}