
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled }) => {
  return (
    <div className="text-center pt-4 pb-8">
      <Button 
        type="submit" 
        size="lg"
        disabled={disabled}
        className="relative overflow-hidden group w-60 h-12"
      >
        <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-primary group-hover:bg-opacity-80 group-hover:skew-x-12"></span>
        <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-primary/80 group-hover:bg-opacity-90 group-hover:-skew-x-12"></span>
        <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-primary -rotate-12"></span>
        <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-primary rotate-12"></span>
        <span className="relative flex items-center justify-center text-md">
          Generate Financial Projection <ArrowRight className="ml-2 h-5 w-5" />
        </span>
      </Button>
    </div>
  );
};

export default SubmitButton;
