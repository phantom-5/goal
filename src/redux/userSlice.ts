import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userData from '../users.json';

// Define user interface
export interface User {
  id: string;
  username: string;
  completedTopics: {
    [key: string]: Record<string, boolean>;
    algorithms: Record<string, boolean>;
    architect: Record<string, boolean>;
    iot: Record<string, boolean>;
    networking: Record<string, boolean>;
    principles: Record<string, boolean>;
  };
}

interface UserState {
  users: User[];
  currentUser: User | null;
}

// Load users from local storage or use empty array
const loadUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  return userData.users;
};

// Save users to local storage
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Load current user from local storage
const loadCurrentUserFromStorage = (): User | null => {
  const storedCurrentUser = localStorage.getItem('currentUser');
  if (storedCurrentUser) {
    return JSON.parse(storedCurrentUser);
  }
  return null;
};

// Save current user to local storage
const saveCurrentUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

const initialState: UserState = {
  users: loadUsersFromStorage(),
  currentUser: loadCurrentUserFromStorage()
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ username: string }>) => {
      const { username } = action.payload;
      
      // Generate a unique ID
      const id = Date.now().toString();
      
      const newUser: User = {
        id,
        username,
        completedTopics: {
          algorithms: {},
          architect: {},
          iot: {},
          networking: {},
          principles: {}
        }
      };
      
      state.users.push(newUser);
      state.currentUser = newUser;
      
      // Save to localStorage
      saveUsersToStorage(state.users);
      saveCurrentUserToStorage(newUser);
    },
    
    setCurrentUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        state.currentUser = user;
        saveCurrentUserToStorage(user);
      }
    },
    
    // Add topic completion for current user
    updateUserTopicCompletion: (state, action: PayloadAction<{
      category: string;
      topicId: string;
      completed: boolean;
    }>) => {
      const { category, topicId, completed } = action.payload;
      
      if (state.currentUser) {
        // Update in-memory state
        if (!state.currentUser.completedTopics[category]) {
          state.currentUser.completedTopics[category] = {};
        }
        
        if (completed) {
          state.currentUser.completedTopics[category][topicId] = true;
        } else {
          delete state.currentUser.completedTopics[category][topicId];
        }
        
        // Update the user in the users array
        const userIndex = state.users.findIndex(u => u.id === state.currentUser?.id);
        if (userIndex !== -1) {
          state.users[userIndex] = state.currentUser;
        }
        
        // Save to localStorage
        saveUsersToStorage(state.users);
        saveCurrentUserToStorage(state.currentUser);
      }
    },
    
    // Reset category progress for current user
    resetUserCategoryProgress: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      
      if (state.currentUser) {
        // Reset the category
        state.currentUser.completedTopics[category] = {};
        
        // Update the user in the users array
        const userIndex = state.users.findIndex(u => u.id === state.currentUser?.id);
        if (userIndex !== -1) {
          state.users[userIndex] = state.currentUser;
        }
        
        // Save to localStorage
        saveUsersToStorage(state.users);
        saveCurrentUserToStorage(state.currentUser);
      }
    },
    
    deleteUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      
      // Remove the user from the users array
      state.users = state.users.filter(user => user.id !== userId);
      
      // If the deleted user was the current user, set currentUser to null
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = null;
      }
      
      // Save to localStorage
      saveUsersToStorage(state.users);
      if (state.currentUser === null) {
        saveCurrentUserToStorage(null);
      }
    }
  }
});

export const { 
  addUser, 
  setCurrentUser, 
  updateUserTopicCompletion, 
  resetUserCategoryProgress,
  deleteUser
} = userSlice.actions;

export default userSlice.reducer; 