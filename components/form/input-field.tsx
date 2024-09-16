import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import type React from "react";

interface InputFieldProps {
  name: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
  submitButton?: React.ReactNode;
  defaultValue?: string | number;
}

const InputField = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  submitButton = false,
  defaultValue = "",
}: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
              />
            </FormControl>

            {submitButton && submitButton}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
