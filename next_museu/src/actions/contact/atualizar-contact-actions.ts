'use server';

import { revalidatePath } from 'next/cache';

import { ContactResponse, ContactUpdate } from '../../schemas/contact-schema';
import { ContactService } from '../../service/connection/ContactService';
import { ApiResponse } from '../../type/api';

export async function atualizarContactAction(
  prevState: ApiResponse<ContactResponse>,
  payload: {
    id: number;
    contactUpdate: ContactUpdate;
  },
): Promise<ApiResponse<ContactResponse>> {
  const contactService = new ContactService();

  const result = await contactService.atualizar(payload.id, payload.contactUpdate);

  revalidatePath('/dashboard/contact');

  return result;
}
