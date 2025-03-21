import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TabValue = 'algorithms' | 'architect' | 'iot' | 'networking' | 'principles';

interface TabState {
  activeTab: TabValue;
}

const initialState: TabState = {
  activeTab: 'algorithms',
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabValue>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer; 