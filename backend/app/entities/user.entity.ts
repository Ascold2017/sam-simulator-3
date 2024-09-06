import { Entity, Column, OneToOne } from "typeorm";
import { AA } from "./aa.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class User extends BaseEntity {

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Здесь будем хранить хэш пароля

  @Column({ default: false })
  isPremium: boolean;

  @OneToOne(() => AA, aa => aa.users)
  aa: AA;
}