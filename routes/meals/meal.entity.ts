import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

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
