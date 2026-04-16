'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, User } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useActionState } from 'react';
import { toast } from 'sonner';
import { salvarContactAction } from '../../../actions/contact/salvar-contact-actions';
import {
  ContactCreate,
  ContactResponse,
  getContactCreateSchema,
} from '../../../schemas/contact-schema';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { ApiResponse } from '../../../type/api';
import { Field, FieldError, FieldLabel } from '../../ui/field';
import { FormContainer } from '../form-layout';

const initialState: ApiResponse<ContactResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

export default function SaveContactForm() {
  const [state, action, isPending] = useActionState(
    salvarContactAction,
    initialState,
  );
  const dict = useDictionary();

  const form = useForm<ContactCreate>({
    resolver: zodResolver(getContactCreateSchema(dict)),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      message: '',
      agreedToPrivacy: false,
    },
  });

  React.useEffect(() => {
    if (!state) return;

    if (state.status >= 400) {
      toast.error('Erro', {
        description: state.erro || state.mensagem,
      });

      if (state.errors) {
        Object.entries(state.errors).forEach(([field, messages]) => {
          form.setError(field as keyof ContactCreate, {
            type: 'server',
            message: messages?.[0],
          });
        });
      }
    } else {
      toast.success('Sucesso!', {
        description: state.mensagem,
      });

      form.reset(); //
    }
  }, [state, form]);
  // 2. Submissão
  const onSubmit = (contactCreate: ContactCreate) => {
    action(contactCreate);
  };

  return (
    <FormContainer
      title={dict.contact.form.create_contact}
      description={dict.contact.form.create_description}
      state={state}
      isPending={isPending}
      formId="form-contato"
      onSubmit={form.handleSubmit(onSubmit)}
      action={dict.contact.form.action}
      confirm={dict.contact.form.confirm}
      href="/dashboard/contact"
      cancel={dict.contact.form.cancel}
    >
      <div className="bg-background space-y-4">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.contact.form.label.firstName}</FieldLabel>
              <div className="relative">
                <User className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                <Input
                  {...field}
                  placeholder={dict.contact.form.label.placeHolderFirstName}
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.contact.form.label.lastName}</FieldLabel>
              <div className="relative">
                <User className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                <Input
                  {...field}
                  placeholder={dict.contact.form.label.placeHolderLastName}
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Phone */}
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.contact.form.label.phone}</FieldLabel>
              <div className="relative">
                <Phone className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                <Input
                  {...field}
                  type="tel"
                  placeholder={dict.contact.form.label.placeHolderPhone}
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.contact.form.label.email}</FieldLabel>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                <Input
                  {...field}
                  type="email"
                  placeholder={dict.contact.form.label.placeHolderEmail}
                  className="pl-10"
                />
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Message */}
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.contact.form.label.message}</FieldLabel>
              <Textarea
                {...field}
                placeholder={dict.contact.form.label.placeHolderMessage}
                className="min-h-32 resize-none"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Privacy Policy */}
        <Controller
          name="agreedToPrivacy"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="privacy"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="privacy" className="text-sm">
                  {dict.contact.form.label.agreedToPrivacy}
                </label>
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </div>
    </FormContainer>
  );
}
