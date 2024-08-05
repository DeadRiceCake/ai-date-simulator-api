import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity('friends_images')
export class FriendImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2000 })
  prompt: string;

  @Column({ name: 'image_url' })
  imageURL: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.friends, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
