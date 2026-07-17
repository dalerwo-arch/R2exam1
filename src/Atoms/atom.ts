import { atom } from 'jotai'

export interface User {
    id: number;
    status: boolean;
    adres: string;
}

export const usersAtom = atom<User[]>([
    { id: 1, status: true, adres: 'Sumqayit' },
    { id: 2, status: false, adres: 'Baku' },
    { id: 3, status: true, adres: 'Gence' },
    { id: 4, status: false, adres: 'Aziz' },
    { id: 5, status: true, adres: 'Mahdi' },
    { id: 6, status: false, adres: 'Kerim' },
]);

export const addUserAtom = atom(
    null,
    (get, set, newUser: User) => {
        set(usersAtom, [...get(usersAtom), newUser]);
    }
);

export const deleteUserAtom = atom(
    null,
    (get, set, id: number) => {
        set(usersAtom, get(usersAtom).filter((user) => user.id !== id));
    }
);

export const updateUserAtom = atom(
    null,
    (get, set, updatedUser: User) => {
        set(
            usersAtom,
            get(usersAtom).map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    }
);

