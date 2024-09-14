import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { AA } from "./aa.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class User extends BaseEntity {

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Здесь будем хранить хэш пароля

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: false })
  isPremium: boolean;

  @ManyToOne(() => AA, aa => aa.users, { onDelete: 'SET NULL', eager: true }) // При удалении AA, поле станет null
  aa: AA;
}