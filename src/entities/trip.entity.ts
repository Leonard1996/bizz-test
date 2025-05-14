import { Entity, Column } from 'typeorm';
import { Common } from '../common/entities/common';

@Entity('trips')
export class Trip extends Common {
  @Column({ type: 'varchar', length: 3 })
  origin: string;

  @Column({ type: 'varchar', length: 3 })
  destination: string;

  @Column({ type: 'decimal' })
  cost: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ name: 'displayName', type: 'varchar' })
  displayName: string;

  @Column({ name: 'originalId', nullable: true, type: 'varchar' })
  originalId: string;
}
