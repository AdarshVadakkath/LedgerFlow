import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "light"
  | "dark"
  | "system"
  | "blue-light"
  | "blue-dark"
  | "green-light"
  | "green-dark"
  | "purple-light"
  | "purple-dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    const colorThemes = ["blue", "green", "purple"];
    const modes = ["light", "dark"];

    // remove all previous classes
    root.classList.remove(...colorThemes, ...modes);

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.add(systemDark ? "dark" : "light");
      return;
    }

    // split theme like "blue-dark"
    const [color, mode] = theme.split("-");

    if (mode && colorThemes.includes(color) && modes.includes(mode)) {
      root.classList.add(mode); // 👈 THIS enables Tailwind dark:
      root.classList.add(color); // 👈 THIS applies your color theme
    } else {
      // fallback for plain light/dark
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
