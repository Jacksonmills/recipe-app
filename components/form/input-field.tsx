import type React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from '../ui/form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  name: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
  disabled?: React.InputHTMLAttributes<HTMLInputElement>['disabled'];
  submitButton?: React.ReactNode;
  defaultValue?: string | number;
  visuallyHideLabel?: boolean;
}

const InputField = ({
  name,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  submitButton,
  defaultValue = '',
  visuallyHideLabel = false,
}: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(visuallyHideLabel && 'sr-only')}>
            {label}
          </FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className='rounded-full'
              />
            </FormControl>

            {submitButton}
          </div>
          <FormDescription className="sr-only">
            {label} input field
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
