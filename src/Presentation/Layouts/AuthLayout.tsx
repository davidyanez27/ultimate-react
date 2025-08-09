import type { ReactComponentInterface } from "../../Interface/interfaces"
import { ThemeToggle } from "../Components";

export const AuthLayout = ({children}: ReactComponentInterface) => {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <div className="flex flex-col items-center max-w-xs">

              <p className="text-center text-gray-400 dark:text-white/60">
                The best assistant to track your projects
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeToggle isHeader={false}/>
        </div>
      </div>
    </div>
  );
}
