import { Entity, Column } from 'typeorm';
import { USER_ROLE } from 'src/common/enums/user.enum';
import { BaseEntity } from '@core/base/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ name: 'is_email_confirmed', type: 'boolean', default: false })
  isEmailConfirmed: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({
    type: 'text',
    nullable: true,
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  role: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  @Column({ type: 'boolean', nullable: true })
  gender: boolean;
}
