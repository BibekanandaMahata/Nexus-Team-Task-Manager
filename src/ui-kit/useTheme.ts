import { useAppDispatch, useAppSelector } from '@/store';
import { setThemeState } from '@/store/themeSlice';
import { ThemeName } from './colors';

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.currentTheme);

  const changeTheme = (newTheme: ThemeName) => {
    dispatch(setThemeState(newTheme));
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  return { theme, changeTheme };
}
