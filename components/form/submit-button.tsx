"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

// SubmitButton Component
const SubmitButton = React.forwardRef<
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
SubmitButton.displayName = "SubmitButton"

// SubmitContent Component
const SubmitButtonContent = React.forwardRef<
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
SubmitButtonContent.displayName = "SubmitButtonContent"

const SubmitButtonLoading = React.forwardRef<
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
SubmitButtonLoading.displayName = "SubmitButtonLoading"

const SubmitButtonSuccess = React.forwardRef<
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
SubmitButtonSuccess.displayName = "SubmitButtonSuccess"

export {
  SubmitButton,
  SubmitButtonContent,
  SubmitButtonLoading,
  SubmitButtonSuccess,
}
