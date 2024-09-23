import { Entity, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class AA extends BaseEntity {
    @Column()
    name: string;

    @Column()
    type: 'guided-missile'

    @Column({ type: 'double precision', default: 100 })
    ammoMinRange: number;

    @Column({ type: 'double precision' })
    ammoMaxRange: number;

    @Column({ type: 'double precision' })
    ammoVelocity: number;

    @Column({ type: 'double precision', default: 30 }) // default 30m
    ammoKillRadius: number;

    @Column({ type: 'double precision', default: 15 })
    ammoMaxOverload: number;

    @Column({ type: 'double precision', default: 0.174533 }) // default - 10 degs
    captureAngle: number;

    @Column({ type: 'double precision', default: 8 })
    ammoCount: number;

    @Column({ default: 0})
    reloadTime: number;

    @OneToMany(() => User, user => user.aa) // Один AA может принадлежать многим пользователям
    users: User[];
}