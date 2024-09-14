import { Entity, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class AA extends BaseEntity {
    @Column()
    name: string;

    @Column()
    type: 'active-missile' | 'gun'

    @Column({ type: 'double precision' })
    ammoMaxRange: number;

    @Column({ type: 'double precision' })
    ammoVelocity: number;

    @Column({ type: 'double precision' })
    viewAngle: number;

    @Column({ type: 'double precision' })
    reloadTime: number;

    @OneToMany(() => User, user => user.aa) // Один AA может принадлежать многим пользователям
    users: User[];
}