import { ContactCreate, ContactResponse, ContactUpdate } from '../../schemas/contact-schema';
import { ConnectionService } from './ConnectionService';

const ENTITY = 'contacts';

export class ContactService extends ConnectionService<ContactResponse, ContactCreate, ContactUpdate> {
  constructor() {
    super(ENTITY);
  }
}
