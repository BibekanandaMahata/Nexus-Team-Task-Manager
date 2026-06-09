'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './index';
import { initializeTheme } from './themeSlice';

function InitializeStoreTheme() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitializeStoreTheme />
      {children}
    </Provider>
  );
}
