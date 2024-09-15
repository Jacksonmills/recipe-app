'use client'

import { DefaultValues, useForm, UseFormProps } from 'react-hook-form';
import { z, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form as RHFForm } from '../ui/form';
import React from 'react';
import { cn } from '@/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  schema: z.ZodObject<ZodRawShape>;
  onSubmit: (data: z.infer<z.ZodType>) => void;
  children: React.ReactNode;
  options?: UseFormProps<z.infer<z.ZodType>>;
}

function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodEffects) {
    return unwrapSchema(schema._def.schema);
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return schema.unwrap();
  }
  return schema;
}

function inferDefaultValues(schema: z.ZodTypeAny): DefaultValues<z.infer<z.ZodTypeAny>> {
  const defaultValues: Record<string, unknown> = {};

  const shape = schema instanceof z.ZodObject ? schema.shape : {};

  for (const key in shape) {
    let field = shape[key];
    field = unwrapSchema(field);
    
    if (field instanceof z.ZodDefault) {
      defaultValues[key] = field._def.defaultValue();
    } else if (field instanceof z.ZodString) {
      defaultValues[key] = '';
    } else if (field instanceof z.ZodNumber) {
      defaultValues[key] = 0;
    } else if (field instanceof z.ZodBoolean) {
      defaultValues[key] = false;
    } else if (field instanceof z.ZodArray) {
      defaultValues[key] = [];
    } else if (field instanceof z.ZodObject) {
      defaultValues[key] = inferDefaultValues(field);
    } else if (field instanceof z.ZodEnum) {
      defaultValues[key] = field.options[0];
    } else if (field instanceof z.ZodDate) {
      defaultValues[key] = new Date();
    }  else if (field instanceof z.ZodLiteral) {
      defaultValues[key] = field.value;
    } else {
      defaultValues[key] = null;
    }
  }

  return defaultValues as DefaultValues<z.infer<z.ZodTypeAny>>;
}

const Form = ({ schema, onSubmit, options, children, className }: FormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: inferDefaultValues(schema),
    ...options,
  });

  return (
    <RHFForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('w-full', className)}>
        {children}
      </form>
    </RHFForm>
  );
};

export default Form;
