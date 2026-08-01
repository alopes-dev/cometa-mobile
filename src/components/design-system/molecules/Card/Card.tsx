import type { ReactNode } from 'react';
import { Container } from './Card.styles';

export type CardProps = {
  children?: ReactNode;
};

export function Card({ children }: CardProps) {
  return <Container>{children}</Container>;
}
