import { Entity, Column, OneToMany } from "typeorm";
import { Target } from "./target.entity";
import { BaseEntity } from "./base.entity";
import { AA } from "./aa.entity";

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

    @OneToMany(() => AA, aa => aa.mission)
    aas: AA[];
}