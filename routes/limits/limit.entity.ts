import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('limits')
export class Limit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  userId!: string;

  @Column({ type: 'float' })
  kcal!: number;

  @Column({ type: 'float' })
  saturatedFat!: number;

  @Column({ type: 'float' })
  sugar!: number;

  @Column({ type: 'float' })
  salt!: number;
}
