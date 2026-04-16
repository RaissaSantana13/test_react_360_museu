'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { atualizarUsuarioAction } from '../../../actions/usuario/atualizar-usuario-actions';
import {
  getUsuarioUpdateSchema,
  UsuarioConsultar,
  UsuarioResponse,
  UsuarioUpdate,
} from '../../../schemas/usuario-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
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

type UsuarioResponseProps = UsuarioResponse;

export default function ConsultarUsuarioForm({
  usuario,
}: {
  usuario: UsuarioResponseProps;
}) {
  const [state] = useActionState(atualizarUsuarioAction, initialState);
  const dict = useDictionary();
  const form = useForm<UsuarioConsultar>({
    resolver: zodResolver(getUsuarioUpdateSchema(dict)),
    defaultValues: {
      idUsuario: usuario.idUsuario,
      username: usuario.username,
      email: usuario.email,
      imagePath: usuario.imagePath ?? '',
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
          form.setError(field as keyof UsuarioUpdate, {
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

  React.useEffect(() => {
    form.register('imagePath');
  }, [form]);

  return (
    <FormContainer
      title={dict.usuario.form.consult_title}
      description={dict.usuario.form.consult_description}
      state={state}
      formId="form-usuario"
      href="/dashboard/usuario"
      cancel={dict.usuario.form.cancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-6">
          <FieldGroup>
            {/* Nome */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.name}:</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Digite o nome"
                    autoComplete="off"
                    readOnly
                  />
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
                  <FieldLabel>{dict.usuario.form.label.email}:</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@exemplo.com"
                    autoComplete="off"
                    readOnly
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        <div className="md:col-span-4 flex flex-col items-center justify-start space-y-4">
          <UploadAvatar
            type="usuarios"
            onChange={(url) => form.setValue('imagePath', url ?? '')}
          />
        </div>
      </div>
    </FormContainer>
  );
}
