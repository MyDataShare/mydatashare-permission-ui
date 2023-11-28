import { User } from './types';

export const addToStorage = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export const getFromStorage = (name: string) => {
  return localStorage.getItem(name) || undefined;
};

export const removeFromStorage = (name: string) => {
  return localStorage.removeItem(name);
};

export const addUserToStorage = (user: Partial<User>) => {
  if (user.token) addToStorage('access_token', user.token);
  if (user.idToken) addToStorage('id_token', user.idToken);
};

export const getUserFromStorage = (): User => {
  return {
    token: getFromStorage('access_token'),
    idToken: getFromStorage('id_token'),
    identifiers: [],
  };
};

export const removeUserFromStorage = () => {
  removeFromStorage('access_token');
  removeFromStorage('id_token');

  // Note values below are legacy and not used, but they should still
  // be kept here so that they are not left orphaned to browser memory.
  // Do not remove!
  removeFromStorage('given_name');
  removeFromStorage('family_name');
  removeFromStorage('username');
  removeFromStorage('identifiers');
  removeFromStorage('identifier');
};
