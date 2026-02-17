import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar' })
  mealName: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'float' })
  kcal: number;

  @Column({ type: 'float' })
  fat: number;

  @Column({ type: 'float' })
  saturatedFat: number;

  @Column({ type: 'float' })
  protein: number;

  @Column({ type: 'float' })
  carb: number;

  @Column({ type: 'float' })
  sugar: number;

  @Column({ type: 'float' })
  salt: number;

  @Column({ type: 'float' })
  fibre: number;
}
