'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { ensureLocalizedPathname } from '@/lib/i18n';
import { ensureRedirectPathname } from '@/lib/utils';

import { ButtonLoading } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ForgotPasswordFormType, getForgotPasswordSchema } from '../../../schemas/forgot-passward-schema';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { LocaleType } from '../../../type/type';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';

export function ForgotPasswordForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dict = useDictionary();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(getForgotPasswordSchema(dict)),
    defaultValues: {
      email: '',
    },
  });

  const locale = params.lang as LocaleType;
  const redirectPathname = searchParams.get('redirectTo');
  const { isSubmitting, isDirty } = form.formState;
  const isDisabled = isSubmitting || !isDirty; // Disable button if form is unchanged or submitting

  async function onSubmit(_data: ForgotPasswordFormType) {
    try {
      toast({
        title: 'Check your email',
        description: "We've sent you an email with instructions to reset your password.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.auth.forgotPassword.email}</FieldLabel>
                  <Input {...field} placeholder={dict.auth.forgotPassword.email} autoComplete="off" />
                  {fieldState.invalid && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          {dict.auth.sendInstruction}
        </ButtonLoading>
        <Link
          href={ensureLocalizedPathname(
            // Include redirect pathname if available, otherwise default to "/sign-in"
            redirectPathname ? ensureRedirectPathname('/sign-in', redirectPathname) : '/sign-in',
            locale,
          )}
          className="-mt-4 text-center text-sm underline"
        >
          {dict.auth.backToSignIn}
        </Link>
      </form>
    </Form>
  );
}
