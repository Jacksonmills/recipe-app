'use client'

import { useForm, UseFormProps } from 'react-hook-form';
import { z, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form as RHFForm } from '../ui/form';
import React from 'react';
import { cn } from '@/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  defaultValues: Record<string, unknown>;
  schema: z.ZodObject<ZodRawShape>;
  onSubmit: (data: z.infer<z.ZodType>) => void;
  children: React.ReactNode;
  options?: UseFormProps<z.infer<z.ZodType>>;
}

const Form = ({ defaultValues, schema, onSubmit, options, children, className }: FormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
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
