import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Permissions } from './permissions.entitty';

@Entity({ name: 'RECURSO' })
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  idResource: number = 0;

  @Column({
    name: 'NOME_RECURSO',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nomeResource: string = '';

  @OneToMany(
    () => Permissions,
    (permission: Permissions) => permission.resource,
  )
  permissions!: Permissions[];

  constructor(data: Partial<Resource> = {}) {
    super();
    Object.assign(this, data);
  }
}
