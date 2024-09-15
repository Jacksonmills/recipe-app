import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";

interface InputFieldProps {
  name: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
  disabled?: React.InputHTMLAttributes<HTMLInputElement>['disabled'];
  submit?: boolean;
}

const InputField = ({
  name,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  submit = false,
}: InputFieldProps) => {
  const { control, formState } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-1">
            <FormControl>
              <Input type={type} placeholder={placeholder} disabled={disabled} {...field} />
            </FormControl>
            {submit && (
              <Button type="submit" disabled={formState.isSubmitting}>
                Submit
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
