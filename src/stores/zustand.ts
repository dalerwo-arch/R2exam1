import { create } from "zustand"

export interface User {
    id: number;
    name: string;
    surName: string;
   
}

interface UserZustand {
    users: User[];
    addUser: (user: User) => void;
    deleteUser: (id: number) => void;
    updateUser: (user: User) => void;
}

export const zustandStore = create<UserZustand>((set) => ({
    users: [
        { id: 1, name: "Ali", surName: "Hasanli"},
        { id: 2, name: "Veli", surName: "Hasanli"},
        { id: 3, name: "Semed", surName: "Hasanli"  },
        { id: 4, name: "Aziz", surName: "Memmedov"  },
        { id: 5, name: "Mahdi", surName: "Aliyev"  },
        { id: 6, name: "Kerim", surName: "Babayev"  },
    ],

    addUser: (newUser: User) =>
        set((state) => ({
            users: [...state.users, newUser],
        })),

    deleteUser: (id: number) =>
        set((state) => ({
            users: state.users.filter((user) => user.id !== id),
        })),

    updateUser: (updatedUser: User) =>
        set((state) => ({
            users: state.users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            ),
        })),
}))



