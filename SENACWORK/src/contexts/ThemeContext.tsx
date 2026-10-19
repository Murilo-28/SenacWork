import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

type Tema = 'claro' | 'escuro';

type ThemeContextType = {
  tema: Tema;
  modoEscuro: boolean;
  mudarTema: (novoTema: Tema) => void;
  resetarTema: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tema, setTema] = useState<Tema>('claro');

  function mudarTema(novoTema: Tema) {
    setTema(novoTema);
  }

  function resetarTema() {
    setTema('claro');
  }

  return (
    <ThemeContext.Provider
      value={{
        tema,
        modoEscuro: tema === 'escuro',
        mudarTema,
        resetarTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTema precisa estar dentro do ThemeProvider'
    );
  }

  return context;
}