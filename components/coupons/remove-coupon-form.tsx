'use client'

import React from 'react';
import { z } from 'zod';
import Form from '../form/form';
import InputField from '../form/input-field';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

const schema = z.object({
  id: z.string().transform((val) => val.toUpperCase()).refine((val) => val.length === 6, {
    message: 'ID must be 6 characters long',
  }),
  groupId: z.literal('remove-coupon'),
  testOptional: z.string().optional(),
  testNullable: z.coerce.number().nullable(),
});

const RemoveCouponForm = () => {
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Form Data:', data);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2>Remove Coupon</h2>
      </CardHeader>
      <CardContent>
        <Form schema={schema} onSubmit={handleSubmit} className='grid gap-4'>
          <InputField name="id" label="ID" />
          <InputField name="groupId" label="Group ID" disabled />
          <InputField name="testOptional" label="Test Optional" />
          <InputField name="testNullable" label="Test Nullable" type="number" />
          <Button type="submit">Remove Coupon</Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RemoveCouponForm;
