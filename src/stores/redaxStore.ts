import { configureStore } from '@reduxjs/toolkit'
import userSlice from '@/slice/todoSlice'

export const redaxStore = configureStore({
  reducer: {
    user: userSlice
  },
})

export type RootState = ReturnType<typeof redaxStore.getState>
export type AppDispatch = typeof redaxStore.dispatch