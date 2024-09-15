import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

interface CheckboxFieldProps {
  name: string;
  label: string;
}

const CheckboxField = ({
  name,
  label,
}: CheckboxFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField control={control} name={name} render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-1">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
