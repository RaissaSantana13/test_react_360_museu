'use server';

import { revalidatePath } from 'next/cache';
import { ContactCreate, ContactResponse } from '../../schemas/contact-schema';
import { ContactService } from '../../service/connection/ContactService';
import { ApiResponse } from '../../type/api';

export async function salvarContactAction(
  prevState: ApiResponse<ContactResponse>,
  contactCreate: ContactCreate,
): Promise<ApiResponse<ContactResponse>> {
  const contactService = new ContactService();

  const result = await contactService.salvar(contactCreate);

  revalidatePath('/dashboard/usuario');

  return result;
}
