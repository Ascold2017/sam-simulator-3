import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

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
}