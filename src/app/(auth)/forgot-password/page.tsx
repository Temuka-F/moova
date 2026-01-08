'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setIsSubmitted(true)
      toast.success('Check your email for the password reset link')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-bold text-primary mb-6">
            moova
            </Link>
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
            Enter your email to receive a reset link
            </p>
        </div>

        {isSubmitted ? (
            <div className="text-center space-y-6">
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                    <p>
                        We have sent a password reset link to your email address. 
                        Please check your inbox (and spam folder).
                    </p>
                </div>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Return to Sign in
                    </Button>
                </Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-12 h-12"
                    {...register('email')}
                />
                </div>
                {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading}
            >
                {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending link...
                </>
                ) : (
                'Send Reset Link'
                )}
            </Button>

            <Link href="/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign in
            </Link>
            </form>
        )}
      </div>
    </div>
  )
}
