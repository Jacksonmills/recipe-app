'use client'

import { useForm, UseFormProps } from 'react-hook-form';
import { z, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '../ui/form';
import React from 'react';
import { cn } from '@/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  schema: z.ZodObject<ZodRawShape>;
  onSubmit: (data: z.infer<z.ZodType>) => void;
  children: React.ReactNode;
  options?: UseFormProps<z.infer<z.ZodType>>;
}

const Form = ({ schema, onSubmit, options, children, className }: FormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    ...options,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('w-full', className)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
