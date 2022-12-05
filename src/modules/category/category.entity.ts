import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@core/base/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;
}
