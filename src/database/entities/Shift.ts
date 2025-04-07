import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from './Enrollment';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Name of the shift (must be unique)'
  })
  name: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.shift)
  enrollments: Enrollment[];
}
