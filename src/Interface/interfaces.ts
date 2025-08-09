
export interface ReactComponentInterface{
    children : React.ReactNode
}

export interface SignInFormDataInterface {
  email: string;
  password: string;
}

export interface SignUpFormDataInterface {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: number;
}

export interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface DropdownItemProps {
  tag?: "a" | "button";
  to?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}