import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number;
  age: number;
  job: string;
}

const initialState: User[] = [
  {
    id: 1,
    age: 20,
    job: "Software Engineer"
  },
  {
    id: 2,
    age: 22,
    job: "Software Engineer"
  },
  {
    id: 3,
    age: 24,
    job: "Software Engineer"
  },
  {
    id: 4,
    age: 18,
    job: "Web Developer"
  },
  {
    id: 5,
    age: 19,
    job: "Web Developer"
  },
  {
    id: 6,
    age: 25,
    job: "FullStack Developer"
  },
]

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload)
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.id !== action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      return state.map((item) => item.id === action.payload.id ? action.payload : item)
    }
  },
})

export const { addUser, deleteUser, updateUser } = userSlice.actions

export default userSlice.reducer
 