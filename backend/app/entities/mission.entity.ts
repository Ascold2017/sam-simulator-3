import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Target } from "./target.entity";
import { Radar } from "./radar.entity";
import { Camera } from "./camera.entity";
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

    @OneToMany(() => Target, target => target.mission)
    targets: Target[];

    @OneToMany(() => Radar, radar => radar.mission)
    radars: Radar[];

    @OneToMany(() => Camera, camera => camera.mission)
    cameras: Camera[];
}