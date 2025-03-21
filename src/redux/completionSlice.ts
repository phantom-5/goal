import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompletionState {
  // Store completed topics in format: { [category]: { [topicId]: boolean } }
  completedTopics: Record<string, Record<string, boolean>>;
}

const initialState: CompletionState = {
  completedTopics: {
    algorithms: {},
    architect: {},
    iot: {},
    networking: {},
    principles: {}
  }
};

export const completionSlice = createSlice({
  name: 'completion',
  initialState,
  reducers: {
    toggleTopicCompletion: (
      state, 
      action: PayloadAction<{ 
        category: string; 
        topicId: string; 
        completed: boolean 
      }>
    ) => {
      const { category, topicId, completed } = action.payload;
      
      if (!state.completedTopics[category]) {
        state.completedTopics[category] = {};
      }
      
      state.completedTopics[category][topicId] = completed;
    },
    // Add ability to reset progress for a category
    resetCategoryProgress: (state, action: PayloadAction<string>) => {
      state.completedTopics[action.payload] = {};
    }
  },
});

export const { toggleTopicCompletion, resetCategoryProgress } = completionSlice.actions;
export default completionSlice.reducer; 