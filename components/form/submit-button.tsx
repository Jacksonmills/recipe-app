import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";

export const SubmitButton = () => {
  const { formState: {
    isSubmitting,
    isSubmitSuccessful
  } } = useFormContext();

  return (
    <Button type="submit" className="w-full">
      {!isSubmitting && !isSubmitSuccessful && 'Apply'}
      {isSubmitting && 'Applying...'}
      {!isSubmitting && isSubmitSuccessful && 'Applied! ✔️'}
    </Button>
  )
}