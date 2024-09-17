'use client';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { type UseFormProps, useForm } from 'react-hook-form';
import type { ZodRawShape, z } from 'zod';
import { FormProvider } from '../ui/form';

interface FormProps {
  schema: z.ZodObject<ZodRawShape>;
  onSubmit: (data: z.infer<z.ZodType>) => void;
  children: React.ReactNode;
  className?: string;
  options?: UseFormProps<z.infer<z.ZodType>>;
}

const Form = ({
  schema,
  onSubmit,
  children,
  className,
  options,
}: FormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    ...options,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('w-full', className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
