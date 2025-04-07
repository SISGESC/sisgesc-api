import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from './Enrollment';

@Entity('classes')
export class ClassGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Name of the grade (must be unique)'
  })
  name: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.classGroup)
  enrollments: Enrollment[];
}
