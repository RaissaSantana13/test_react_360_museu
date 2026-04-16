import { z } from 'zod';
import { DictionaryType } from '../type/type';

export const getForgotPasswordSchema = (dict: DictionaryType) => {
  const { validation } = dict.auth;
  return z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .check(z.email({ message: validation.invalidEmail })),
  });
};

export type ForgotPasswordFormType = z.infer<ReturnType<typeof getForgotPasswordSchema>>;
