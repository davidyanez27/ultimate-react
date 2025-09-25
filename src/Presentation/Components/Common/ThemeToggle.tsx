import { SunIcon, MoonIcon } from "../../Assets/icons";
import { useTheme } from "../../Context";

type ThemeToggleProps = { isHeader: boolean };

export const ThemeToggle = ({isHeader}:ThemeToggleProps) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`items-center justify-center ${isHeader ? "relative flex  text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white":
      "inline-flex text-white transition-colors rounded-full size-14 bg-brand-500 hover:bg-brand-600"}`}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </button>
  );
}
