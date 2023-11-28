import { CSSProperties, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  title: string;
  showCloseButton?: boolean;
  style?: CSSProperties;
  onClose?: () => void;
}

export default ModalProps;
