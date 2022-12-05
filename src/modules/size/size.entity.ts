import { BaseEntity } from '@core/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('sizes')
export class Size extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;
}
