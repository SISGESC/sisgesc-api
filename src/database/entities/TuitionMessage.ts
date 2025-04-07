import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Tuition } from './Tuition';

@Entity('tuition_messages')
export class TuitionMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { default: () => 'uuid_generate_v4()', unique: true })
  uuid: string;

  @ManyToOne(() => Tuition, (tuition) => tuition.messages, { nullable: false })
  @JoinColumn({ name: 'tuition_id' })
  tuition: Tuition;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'The first message starts with a receipt url sent by the parent'
  })
  message: string;

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
}
