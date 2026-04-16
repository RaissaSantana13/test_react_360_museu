'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { salvarUsuarioAction } from '../../../actions/usuario/salvar-usuario-actions';
import {
  getUsuarioCreateFormSchema,
  UsuarioCreate,
  UsuarioCreateForm,
  UsuarioResponse,
} from '../../../schemas/usuario-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
import { ApiResponse } from '../../../type/api';
import { UploadAvatar } from '../../shared/crop/upload-avatar';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { FormContainer } from '../form-layout';

const initialState: ApiResponse<UsuarioResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

export default function SalvarUsuarioForm() {
  const [state, action, isPending] = useActionState(salvarUsuarioAction, initialState);
  const dict = useDictionary();
  const form = useForm<UsuarioCreateForm>({
    resolver: zodResolver(getUsuarioCreateFormSchema(dict)),
    defaultValues: {
      nomeUsuario: '',
      email: '',
      imagePath: '',
      senha: '',
      confirmSenha: '',
    },
  });

  const { getEndpoint } = useResources();

  const urlCreate = getEndpoint('usuario');

  useEffect(() => {
    if (!state) return;

    if (state.status >= 400) {
      toast.error('Erro', {
        description: state.erro || state.mensagem,
      });

      if (state.errors) {
        Object.entries(state.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UsuarioCreate, {
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

  function onSubmit(data: UsuarioCreate) {
    if (!urlCreate) return toast.error('Configuração de API não encontrada');

    const parsed = getUsuarioCreateFormSchema(dict).parse(data);
    startTransition(() => {
      action({
        usuarioCreate: parsed,
        url: urlCreate,
      });
    });
  }

  React.useEffect(() => {
    form.register('imagePath');
  }, [form]);

  return (
    <FormContainer
      title={dict.usuario.form.create_title}
      description={dict.usuario.form.create_description}
      state={state}
      isPending={isPending}
      formId="form-usuario"
      onSubmit={form.handleSubmit(onSubmit)}
      action={dict.usuario.form.action}
      confirm={dict.usuario.form.confirm}
      href="/dashboard/usuario"
      cancel={dict.usuario.form.cancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-6">
          <FieldGroup>
            {/* Nome */}
            <Controller
              name="nomeUsuario"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.name}:</FieldLabel>
                  <Input {...field} placeholder="Digite o nome" autoComplete="off" />
                  {fieldState.invalid && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.email}:</FieldLabel>
                  <Input {...field} type="email" placeholder="email@exemplo.com" autoComplete="off" />
                  {fieldState.invalid && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Senha */}
            <Controller
              name="senha"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.password}:</FieldLabel>
                  <Input {...field} type="password" placeholder="******" />
                  {fieldState.invalid && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            {/* ConfirmSenha */}
            <Controller
              name="confirmSenha"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.confirmPassword}:</FieldLabel>
                  <Input {...field} type="password" placeholder="******" />
                  {fieldState.invalid && fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        <div className="md:col-span-4 flex flex-col items-center justify-start space-y-4">
          <UploadAvatar type="usuarios" onChange={(url) => form.setValue('imagePath', url ?? '')} />
        </div>
      </div>
    </FormContainer>
  );
}
