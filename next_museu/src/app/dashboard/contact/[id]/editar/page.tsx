import { notFound } from 'next/navigation';
import { AtualizarContact } from '../../../../../components/contact/atualizar-contato';
import { ContactResponse } from '../../../../../schemas/contact-schema';
import { ContactService } from '../../../../../service/connection/ContactService';
import { ApiResponse } from '../../../../../type/api';

async function getPorId(id: string): Promise<ApiResponse<ContactResponse>> {
  const contactService = new ContactService();
  const data = await contactService.porId(id);
  return data;
}

export default async function ContactAtualizar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getPorId(id);
  if (!response.dados) {
    notFound();
  }
  return <AtualizarContact contact={response.dados} />;
}
