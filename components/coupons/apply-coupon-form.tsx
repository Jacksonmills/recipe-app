'use client'

import { z } from "zod";
import Form from "../form/form";
import InputField from "../form/input-field";
import { applyCouponCode } from "./actions";
import CheckboxField from "../form/checkbox-field";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { SubmitButton, SubmitButtonContent, SubmitButtonLoading, SubmitButtonSuccess } from "../form/submit-button";
import { FormGroup } from "../ui/form";

const schema = z.object({
  code: z.string().min(4).max(8),
  agreement: z.boolean().refine((val) => val === true, {
    message: "Please read and accept the terms and conditions",
  })
})

const ApplyCouponForm = () => {
  const onSubmit = async (data: z.infer<typeof schema>) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const formData = new FormData();
    formData.append('code', data.code);
    formData.append('agreement', data.agreement.toString());
    applyCouponCode(formData)
  }

  const submitButton = (
    <div>
      <SubmitButton>
        <SubmitButtonContent>
          Apply 
        </SubmitButtonContent>
        <SubmitButtonLoading>
          Applying...
        </SubmitButtonLoading>
        <SubmitButtonSuccess>
          Applied! ✔️
        </SubmitButtonSuccess>
      </SubmitButton>
    </div>
  )

  return (
    <Card className="p-4 h-fit">
      <CardHeader>
        <h2>Apply Coupon</h2>
      </CardHeader>
      <CardFooter>
        <Form onSubmit={onSubmit} schema={schema}>
          <div className="grid gap-4">
            <FormGroup name="apply coupon code form group" className="grid gap-4">
              <InputField
                name="code"
                label="Coupon Code"
                placeholder="Enter your coupon code"
                submitButton={submitButton}
              />
              <CheckboxField name="agreement" label="I agree to the terms and conditions" />
            </FormGroup>
          </div>
        </Form>
      </CardFooter>
    </Card>
  );
};

export default ApplyCouponForm;
