import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Enrollment } from './Enrollment';
import { TuitionMessage } from './TuitionMessage';

@Entity('tuitions')
export class Tuition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { default: () => 'uuid_generate_v4()', unique: true })
  uuid: string;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.tuitions, { nullable: false })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({
    type: 'varchar',
    length: 22,
    nullable: false,
    unique: true,
    comment: 'Unique code for the tuition payment'
  })
  code: string;

  @Column({
    name: 'due_date',
    type: 'date',
    nullable: false,
    comment: 'Due date for the tuition payment'
  })
  dueDate: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Amount to be paid (stored as string for precise decimal handling)'
  })
  amount: string;

  @Column({
    name: 'is_enrollment',
    type: 'boolean',
    default: false,
    comment: 'Indicates if this is an enrollment fee'
  })
  isEnrollment: boolean;

  @Column({
    name: 'is_paid',
    type: 'boolean',
    default: false,
    comment: 'Indicates if the tuition has been paid'
  })
  isPaid: boolean;

  @Column({
    name: 'paid_at',
    type: 'date',
    nullable: true,
    comment: 'Date when the payment was mark as paid'
  })
  paidAt: Date;

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

  @OneToMany(() => TuitionMessage, (tuitionMessage) => tuitionMessage.tuition)
  messages: TuitionMessage[];
}
