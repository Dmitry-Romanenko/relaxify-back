import { Label } from '@prisma/client';
import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateBaseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsIn([
    'Mindfulness',
    'Self-compassion',
    'Stress relief',
    'Focus',
    'Relaxation',
    'Nature',
    'Cozy',
    'Energy',
  ])
  @IsNotEmpty()
  tag: string;

  @IsIn(['Meditation', 'Article', 'Sound'])
  @IsNotEmpty()
  label: Label;

  @IsString()
  @IsNotEmpty()
  description: string;

  duration?: number;
  slug?: string;
}

export class UpdateBaseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsIn(['Meditation', 'Article', 'Sound'])
  @IsOptional()
  label?: Label;

  @IsString()
  @IsOptional()
  description?: string;

  duration?: number;
  slug?: string;
}
