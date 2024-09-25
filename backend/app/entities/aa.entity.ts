import { Entity, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class AA extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: 'double precision', default: 100 })
    missileMinRange: number;

    @Column({ type: 'double precision' })
    missileMaxRange: number;

    @Column({ type: 'double precision' })
    missileVelocity: number;

    @Column({ type: 'double precision', default: 30 }) // default 30m
    missileKillRadius: number;

    @Column({ type: 'double precision', default: 15 })
    missileMaxOverload: number;

    @Column({ type: 'double precision', default: 0.174533 }) // default - 10 degs
    captureAngle: number;

    @Column({ default: 8 })
    captureChannelCount: number;

    @Column({ type: 'double precision', default: 8 })
    missileCount: number;

    @Column({ default: 0, type: 'double precision',})
    reloadTime: number;

    @OneToMany(() => User, user => user.aa) // Один AA может принадлежать многим пользователям
    users: User[];
}