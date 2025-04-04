import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  groupIds?: string[];
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Create slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Placeholder reducers for future implementation
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
