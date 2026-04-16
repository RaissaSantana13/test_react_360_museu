import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Action } from '../enum/action.enum';
import { Possession } from '../enum/possession.enum';
import { Resource } from './resources.entity';
import { Role } from './role.entity';

@Entity('PERMISSIONS')
export class Permissions extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPermission: number = 0;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'ROLE_ID' })
  role!: Role;

  @ManyToOne(() => Resource, (resource) => resource.permissions)
  @JoinColumn({ name: 'RECURSO_ID' })
  resource!: Resource;

  @Column({
    type: 'varchar',
    length: 20,
    enum: Action, // Validação em nível de código
  })
  action: string = Action.READ;

  @Column({
    type: 'varchar',
    length: 10,
    default: Possession.ANY,
  })
  possession: string = Possession.ANY;

  constructor(data: Partial<Permissions> = {}) {
    super();
    Object.assign(this, data);
  }
}
