import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);

// Loads portfolio content once and shares it with every page.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    setError('');
    api.content().then(setContent).catch(() =>
      setError("Couldn't reach the API. If the site was asleep it can take up to a minute to wake up."));
  }, []);
  useEffect(() => { load(); }, [load]);
  return <Ctx.Provider value={{ content, error, reload: load }}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Arpit Kumar` : 'Arpit Kumar · Data Analyst & ML';
  }, [title]);
}
