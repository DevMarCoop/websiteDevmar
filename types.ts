import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
}

export interface LayoutProps {
  children: ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: ReactNode;
  className?: string;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}