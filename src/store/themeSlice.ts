import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeName } from '@/ui-kit';

interface ThemeState {
  currentTheme: ThemeName;
}

const initialState: ThemeState = {
  currentTheme: 'default',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeState: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
    },
    initializeTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as ThemeName;
        const validThemes: ThemeName[] = ['default', 'red', 'green', 'purple', 'sunset', 'pink', 'indigo', 'gray'];
        if (validThemes.includes(savedTheme)) {
          state.currentTheme = savedTheme;
        }
      }
    },
  },
});

export const { setThemeState, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
