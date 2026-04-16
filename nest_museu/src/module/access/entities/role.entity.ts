import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Permissions } from './permissions.entitty';

@Entity({ name: 'ROLE' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRole: number = 0;

  @Column({
    name: 'NOME_ROLE',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nomeRole: string = '';

  @OneToMany(() => Permissions, (permission: Permissions) => permission.role)
  permissions!: Permissions[];

  @ManyToMany(() => Usuario, (usuario) => usuario.role)
  usuario!: Usuario[];

  constructor(data: Partial<Role> = {}) {
    super();
    Object.assign(this, data);
  }
}
