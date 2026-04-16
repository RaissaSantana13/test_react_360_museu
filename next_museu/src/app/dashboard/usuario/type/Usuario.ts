import z from 'zod';

/* eslint-disable @typescript-eslint/no-unused-vars */
const UsuarioSchema = z.object({
  idUsuario: z.number(),

  nomeUsuario: z
    .string()
    .min(5, 'O nome deve conter pelo menos 5 caracteres.')
    .max(100, 'O nome deve conter no máximo 100 caracteres.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .check(z.email({ message: 'E-mail inválido' })),

  ativo: z.boolean(),
});

export type UsuarioList = z.infer<typeof UsuarioSchema>; // usando para consulta

/* ================= CREATE ================= */

export const UsuarioCreateSchema = UsuarioSchema.omit({ idUsuario: true, ativo: true })
  .extend({
    senha: z.string().min(6),
    confirmSenha: z.string().min(6),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmSenha'],
  });

export type UsuarioCreate = z.infer<typeof UsuarioCreateSchema>;

/* ================= UPDATE ================= */

export const UsuarioUpdateSchema = UsuarioSchema.omit({
  idUsuario: true,
  ativo: true,
}).partial();

export type UsuarioUpdate = z.infer<typeof UsuarioUpdateSchema>;

/* ================= UPDATE SENHA ================= */

export const UsuarioUpdateSenhaSchema = z
  .object({
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmSenha: z.string().min(6),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmSenha'],
  })
  .transform(({ confirmSenha: _confirmSenha, ...rest }) => rest);

export type UsuarioUpdateSenha = z.infer<typeof UsuarioUpdateSenhaSchema>;


