"use client";

import React from "react";
import { z } from "zod";
import CheckboxField from "../form/checkbox-field";
import {
  FormSubmit,
  FormSubmitIdle,
  FormSubmitSuccess,
} from "../form/form-submit";
import InputField from "../form/input-field";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Form } from "../ui/form";

const schema = z.object({
  id: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => val.length === 6, {
      message: "ID must be 6 characters long",
    }),
  groupId: z.literal("remove-coupon"),
  testOptional: z.string().optional(),
  testNullable: z.coerce.number().nullable(),
  disabledCheckbox: z.boolean(),
});

const RemoveCouponForm = () => {
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log("Form Data:", data);
  };

  return (
    <Card className="p-4 h-fit">
      <CardHeader>
        <h2>Remove Coupon</h2>
      </CardHeader>
      <CardContent>
        <Form schema={schema} onSubmit={handleSubmit} className="grid gap-4">
          <InputField name="id" label="ID" />
          <InputField
            name="groupId"
            label="Group ID"
            disabled
            defaultValue={"remove-coupon"}
          />
          <InputField name="testOptional" label="Test Optional" />
          <InputField
            name="testNullable"
            label="Test Nullable"
            type="number"
            defaultValue={0}
          />
          <CheckboxField
            name="disabledCheckbox"
            label="Disabled Checkbox"
            defaultValue={true}
            disabled={true}
          />

          <FormSubmit>
            <FormSubmitIdle>Remove Coupon</FormSubmitIdle>
            <FormSubmitSuccess>Removed!</FormSubmitSuccess>
          </FormSubmit>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RemoveCouponForm;
