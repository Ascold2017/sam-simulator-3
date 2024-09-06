import { Entity, Column, ManyToMany, ManyToOne } from "typeorm";
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

    @ManyToOne(() => User, user => user.aa)
    users: User[]
}