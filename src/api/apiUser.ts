import { removeCookie, setCookie } from '../services/cookies';
import { UserApiType } from '../type';
import { UserType } from './../type/UserType';
import { get, post, put, remove } from './api';

function renderUser(user: UserApiType): UserType {
  return {
    id: user._id,
    username: user.username,
    role: user.role,
    address: user.address,
    email: user.email,
    phone: user.phone,
    country: user.country,
  };
}

export async function userLogin(username: string, password: string) {
  try {
    const res = await post('login', {
      username: username,
      password: password,
    });
    const data = await res.json();
    setCookie('restauration', data.token);
    setCookie('userId', data.user);
    if (res.status === 400 || res.status === 401) {
      return {
        user: undefined,
        message: `${data.message}. ${data.error ? data.error : ''}`,
      };
    } else {
      return {
        user: await getUser(data.user),
        message: 'Connection réussie',
      };
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getUser(id: string) {
  const res = await get(`users/${id}`);
  return renderUser(await res.json());
}

export async function getUsers() {
  const res = await get('users');
  const users = await res.json();
  return users.map((user: UserApiType) => renderUser(user));
}

export async function logoutUser() {
  await get('logout');
  removeCookie('restauration');
  removeCookie('userId');
}

export async function createUser(
  user: UserType & {
    password: string;
  }
): Promise<Response> {
  const req = await post('signup', user);
  return req;
}

export async function updateUser(user: UserType): Promise<Response> {
  const req = await put(`user/update`, user);
  return req;
}

export async function removeUser(id: string) {
  await remove(`users/${id}`);
}
