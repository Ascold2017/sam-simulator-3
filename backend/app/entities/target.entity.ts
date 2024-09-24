import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MissionTarget } from "./missionTarget.entity";

@Entity()
export class Target extends BaseEntity {
    @Column()
    name: string;
    
    @Column({ nullable: true })
    modelName: string;

    @Column({ nullable: true })
    soundName: string;
    
    @Column({ type: 'double precision' })
    rcs: number;

    @Column({ type: 'double precision' })
    temperature: number;

    @Column({ type: 'double precision' })
    size: number;

    @OneToMany(() => MissionTarget, missionTarget => missionTarget.target)
    missionTargets: MissionTarget[]
}