import type React from "react";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "../ui/form";

interface CheckboxFieldProps {
  name: string;
  label: string;
  disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
  defaultValue?: boolean;
}

const CheckboxField = ({
  name,
  label,
  disabled = false,
  defaultValue = false,
}: CheckboxFieldProps) => {
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
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
