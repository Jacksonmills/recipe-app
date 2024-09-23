'use client';

import { z } from 'zod';
import CheckboxField from './form/checkbox-field';
import {
  FormSubmit,
  FormSubmitIdle,
  FormSubmitLoading,
  FormSubmitSuccess,
} from './form/form-submit';
import InputField from './form/input-field';
import { Card, CardContent, CardHeader } from './ui/card';
import { Form } from './ui/form';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  'news-agreement': z.boolean().refine((val) => val === true, {
    message: 'Please read and accept the terms and conditions',
  }),
});

const NewsletterSignupForm = () => {
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Form Data:', data);
  };

  return (
    <Card className="p-4 h-fit">
      <CardHeader>
        <h2>Newsletter Signup</h2>
      </CardHeader>
      <CardContent>
        <Form
          label="Newsletter Signup"
          schema={schema}
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email address"
          />
          <CheckboxField
            name="news-agreement"
            label="I agree to the terms and conditions"
          />

          <FormSubmit>
            <FormSubmitIdle>Sign Up</FormSubmitIdle>
            <FormSubmitLoading>Signing Up...</FormSubmitLoading>
            <FormSubmitSuccess>Signed Up!</FormSubmitSuccess>
          </FormSubmit>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignupForm;
