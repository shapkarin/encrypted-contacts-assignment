import { actions as contactsActions } from '../../src/Actions/contacts';
import { actions as userActions } from '../../src/Actions/user';

describe('Contacts actions', () => {
  const contact = {
    name: 'Some Name',
    phone: '+123683046203',
    email: 'some@name.com',
    address: 'Mars',
    id: 'hyPwOpMbn1IRaHQP',
  };

  const updated = {
    ...contact,
    name: 'Other Name',
  };

  const contacts = [...Array(10)].map(() => contact);

  const expectedActions = {
    create: {
      type: 'contacts/CREATE',
      payload: contact,
    },
    update: {
      type: 'contacts/UPDATE',
      payload: updated,
    },
    remove: {
      type: 'contacts/REMOVE',
      payload: contact.id,
    },
    load: {
      type: 'contacts/LOAD',
      payload: contacts,
    },
    show: {
      type: 'contacts/SHOW_BY_ID',
      payload: contact.id,
    },
  };

  it('should create the action to create the contact', () => {
    expect(contactsActions.create(contact)).toEqual(expectedActions.create);
  });

  it('should create the action to update the contact', () => {
    expect(contactsActions.update(updated)).toEqual(expectedActions.update);
  });

  it('should create the action to show the contact', () => {
    expect(contactsActions.show(contact.id)).toEqual(expectedActions.show);
  });

  it('should create the action to remove the contact', () => {
    expect(contactsActions.remove(contact.id)).toEqual(expectedActions.remove);
  });
});

describe('User actions', () => {
  const error = 'The password is incorrect';

  const expectedActions = {
    create: {
      type: 'user/CREATE',
    },
    check: {
      type: 'user/CHECK',
      payload: true,
    },
    error: {
      type: 'user/ERROR',
      payload: error,
    },
  };

  it('should create the action to create a user', () => {
    expect(userActions.create()).toEqual(expectedActions.create);
  });

  it('should create the action to check a password', () => {
    expect(userActions.check(true)).toEqual(expectedActions.check);
  });

  it('should create the action to add the error', () => {
    expect(userActions.error(error)).toEqual(expectedActions.error);
  });

});
