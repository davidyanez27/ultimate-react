
import { LoadingSpinnerIcon } from "../../Assets/icons";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ 
  className = "", 
  size = "md" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  return (
    <LoadingSpinnerIcon 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};