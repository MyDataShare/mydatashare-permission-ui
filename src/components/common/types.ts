import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonSize = 'small' | 'normal' | 'large';

export type ButtonVariant = 'primary' | 'secondary' | 'supplementary';

export type ButtonCommonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: any) => void;
  size?: ButtonSize;
  customStyles?: any;
};

export type ButtonProps = ButtonCommonProps & {
  variant?: ButtonVariant;
};

export type FillButtonVariant = 'accept' | 'decline' | 'negative';

export type FillButtonProps = ButtonCommonProps & {
  variant: FillButtonVariant;
  icon?: IconDefinition;
};

export type VirtualListContext = {
  isScrolling: boolean;
  loading?: boolean;
  loadMoreItems?: () => void;
};

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  ALERT = 'warning',
}
