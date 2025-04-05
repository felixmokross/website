import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { ComputerDesktopIcon, MoonIcon, SunIcon } from "~/components/icons";

function useSyncToSystemTheme(isEnabled: boolean) {
  useEffect(() => {
    function onMediaQueryChanged(e: MediaQueryListEvent) {
      updateCurrentTheme(e.matches ? "dark" : "light");
    }

    const mediaQuery = getDarkModeMediaQuery();
    if (isEnabled) {
      mediaQuery.addEventListener("change", onMediaQueryChanged);
    } else {
      mediaQuery.removeEventListener("change", onMediaQueryChanged);
    }

    return () => mediaQuery.removeEventListener("change", onMediaQueryChanged);
  }, [isEnabled]);
}

export function ThemeInitScript() {
  // Best to add inline in 'head' to avoid FOUC
  return (
    <script type="text/javascript">
      {`
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );`}
    </script>
  );
}

function getDarkModeMediaQuery() {
  return window.matchMedia("(prefers-color-scheme: dark)");
}

export function ThemeToggle() {
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>();
  useLayoutEffect(() => {
    setThemeSetting(getStoredThemeSetting());
  }, []);

  useSyncToSystemTheme(themeSetting === "system");

  function onThemeSelected(themeSetting: ThemeSetting) {
    setThemeSetting(themeSetting);
    updateCurrentTheme(themeSetting);
    storeThemeSetting(themeSetting);
  }

  return (
    <div className="relative h-10 w-11 overflow-hidden rounded-full shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
      <ThemeButton
        icon={MoonIcon}
        isSelected={themeSetting === "dark"}
        onSelected={() => onThemeSelected("light")}
        title="Dark Theme"
      />
      <ThemeButton
        icon={SunIcon}
        isSelected={themeSetting === "light"}
        onSelected={() => onThemeSelected("system")}
        title="Light Theme"
      />
      <ThemeButton
        icon={ComputerDesktopIcon}
        isSelected={themeSetting === "system"}
        onSelected={() => onThemeSelected("dark")}
        title="System Theme"
      />
    </div>
  );
}

function getStoredThemeSetting(): ThemeSetting {
  return localStorage.theme === "dark"
    ? "dark"
    : localStorage.theme === "light"
      ? "light"
      : "system";
}

function storeThemeSetting(themeSetting: ThemeSetting) {
  if (themeSetting === "dark") {
    localStorage.theme = "dark";
  } else if (themeSetting === "light") {
    localStorage.theme = "light";
  } else {
    localStorage.removeItem("theme");
  }
}

function updateCurrentTheme(themeSetting: ThemeSetting) {
  const theme = themeSetting === "system" ? getSystemTheme() : themeSetting;

  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getSystemTheme(): Theme {
  return getDarkModeMediaQuery().matches ? "dark" : "light";
}

type Theme = "dark" | "light";
type ThemeSetting = Theme | "system";

function ThemeButton({
  isSelected,
  onSelected,
  icon: Icon,
  title,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isSelected: boolean;
  onSelected: () => void;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {isSelected ? (
        <motion.button
          animate={{ translateY: 0 }}
          initial={{ translateY: "-100%" }}
          exit={{ translateY: "100%" }}
          className={clsx(
            "absolute top-1/2 left-1/2 -translate-1/2 fill-zinc-500 py-2.5 hover:fill-zinc-600 dark:fill-zinc-400 dark:hover:fill-zinc-300",
          )}
          onClick={() => onSelected()}
          title={title}
        >
          <Icon className="size-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
