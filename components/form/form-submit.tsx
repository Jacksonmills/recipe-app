"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

const FormSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="submit"
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </Button>
  )
})
FormSubmit.displayName = "FormSubmit"

const FormSubmitIdle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext()

  if (isSubmitting || isSubmitSuccessful) return null

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
FormSubmitIdle.displayName = "FormSubmitIdle"

const FormSubmitLoading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext()

  if (!isSubmitting || isSubmitSuccessful) return null

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
FormSubmitLoading.displayName = "FormSubmitLoading"

const FormSubmitSuccess = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const {
    formState: { isSubmitSuccessful },
  } = useFormContext()

  if (!isSubmitSuccessful) return null

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
FormSubmitSuccess.displayName = "FormSubmitSuccess"

export {
  FormSubmit,
  FormSubmitIdle,
  FormSubmitLoading,
  FormSubmitSuccess,
}
