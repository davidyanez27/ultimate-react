import { Link } from "react-router";
import { useSidebar } from "../Context"
import { HorizontaLDots } from "../Assets/icons";
import { MenuItems, navItems } from "../Components";
import { SidebarWidget } from "./SidebarWidget";



export const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar();

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-gray-dark dark:text-gray-500">
              Mechventory
            </span>
          ) : (
            <span className="text-gray-dark dark:text-gray-500">
              M
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-col h-full overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              <MenuItems items={navItems} menuType="main" />
            </div>

          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? 
          <div className="mt-auto">
            <SidebarWidget />
          </div>
        : null}
      </div>
    </aside>
  );
}
