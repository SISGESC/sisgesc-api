import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, DeleteDateColumn } from 'typeorm';
import { ClassGroup } from './ClassGroup';
import { Shift } from './Shift';
import { Tuition } from './Tuition';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { default: () => 'uuid_generate_v4()', unique: true })
  uuid: string;

  @ManyToOne(() => ClassGroup, (classGroup) => classGroup.enrollments, { nullable: false })
  @JoinColumn({ name: 'class_id' })
  classGroup: ClassGroup;

  @ManyToOne(() => Shift, (shift) => shift.enrollments, { nullable: false })
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column({
    name: 'parent_id',
    type: 'varchar',
    length: 50,
    comment: 'User from QuotiAuth.middleware',
    nullable: false,
  })
  parentId: string;

  @Column({
    name: 'student_name',
    type: 'varchar',
    length: 255,
    comment: 'Student name (for display purposes)',
    nullable: false,
  })
  studentName: string

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indicates if the enrollment is active'
  })
  status: boolean;

  @Column({
    name: 'is_daycare',
    type: 'boolean',
    nullable: false,
    comment: 'Indicates if the enrollment includes daycare'
  })
  isDaycare: boolean;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({ 
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => Tuition, (tuition) => tuition.enrollment)
  tuitions: Tuition[];
}
