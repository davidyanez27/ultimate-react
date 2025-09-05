import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem, SubItem } from "../../types";
import { navItems, othersItems } from "./NavItems";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../../Context";
import { ChevronDownIcon } from "../../Assets/icons";

interface MenuItemsProps {
    items: NavItem[];
    menuType: "main" | "others";
}

interface SubMenuItemsProps {
    items: SubItem[];
    level: number;
    parentKey: string;
}

// Component for handling nested subitems
const SubMenuItems = ({ items, level, parentKey }: SubMenuItemsProps) => {
    const { isExpanded, isMobileOpen, isHovered } = useSidebar();
    const location = useLocation();
    const [openNestedSubmenu, setOpenNestedSubmenu] = useState<Record<string, boolean>>({});
    const [nestedSubMenuHeight, setNestedSubMenuHeight] = useState<Record<string, number>>({});
    const nestedSubMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {
        items.forEach((item, index) => {
            if (item.subItems) {
                const hasActiveChild = item.subItems.some(subItem => 
                    subItem.path && isActive(subItem.path)
                );
                if (hasActiveChild) {
                    const key = `${parentKey}-${index}`;
                    setOpenNestedSubmenu(prev => ({ ...prev, [key]: true }));
                }
            }
        });
    }, [location, items, parentKey, isActive]);

    useEffect(() => {
        Object.keys(openNestedSubmenu).forEach(key => {
            if (openNestedSubmenu[key] && nestedSubMenuRefs.current[key]) {
                setNestedSubMenuHeight(prev => ({
                    ...prev,
                    [key]: nestedSubMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        });
    }, [openNestedSubmenu]);

    const handleNestedSubmenuToggle = (index: number) => {
        const key = `${parentKey}-${index}`;
        setOpenNestedSubmenu(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const marginLeft = level === 1 ? "ml-9" : level === 2 ? "ml-12" : "ml-15";

    return (
        <ul className={`mt-2 space-y-1 ${marginLeft}`}>
            {items.map((subItem, index) => {
                const itemKey = `${parentKey}-${index}`;
                return (
                    <li key={subItem.name}>
                        {subItem.subItems && subItem.subItems.length > 0 ? (
                            <>
                                <button
                                    onClick={() => handleNestedSubmenuToggle(index)}
                                    className={`menu-dropdown-item cursor-pointer w-full text-left ${
                                        subItem.subItems.some(nested => nested.path && isActive(nested.path))
                                            ? "menu-dropdown-item-active"
                                            : "menu-dropdown-item-inactive"
                                    }`}
                                >
                                    {subItem.name}
                                    <span className="flex items-center gap-1 ml-auto">
                                        {subItem.new && (
                                            <span className="menu-dropdown-badge menu-dropdown-badge-inactive">
                                                new
                                            </span>
                                        )}
                                        {subItem.pro && (
                                            <span className="menu-dropdown-badge menu-dropdown-badge-inactive">
                                                pro
                                            </span>
                                        )}
                                        <ChevronDownIcon
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                openNestedSubmenu[itemKey] ? "rotate-180" : ""
                                            }`}
                                        />
                                    </span>
                                </button>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <div
                                        ref={(el) => {
                                            nestedSubMenuRefs.current[itemKey] = el;
                                        }}
                                        className="overflow-hidden transition-all duration-300"
                                        style={{
                                            height: openNestedSubmenu[itemKey]
                                                ? `${nestedSubMenuHeight[itemKey]}px`
                                                : "0px",
                                        }}
                                    >
                                        <SubMenuItems
                                            items={subItem.subItems}
                                            level={level + 1}
                                            parentKey={itemKey}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to={subItem.path}
                                className={`menu-dropdown-item ${
                                    isActive(subItem.path)
                                        ? "menu-dropdown-item-active"
                                        : "menu-dropdown-item-inactive"
                                }`}
                            >
                                {subItem.name}
                                <span className="flex items-center gap-1 ml-auto">
                                    {subItem.new && (
                                        <span
                                            className={`ml-auto ${
                                                isActive(subItem.path)
                                                    ? "menu-dropdown-badge-active"
                                                    : "menu-dropdown-badge-inactive"
                                            } menu-dropdown-badge`}
                                        >
                                            new
                                        </span>
                                    )}
                                    {subItem.pro && (
                                        <span
                                            className={`ml-auto ${
                                                isActive(subItem.path)
                                                    ? "menu-dropdown-badge-active"
                                                    : "menu-dropdown-badge-inactive"
                                            } menu-dropdown-badge`}
                                        >
                                            pro
                                        </span>
                                    )}
                                </span>
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export const MenuItems = ({ items, menuType }: MenuItemsProps) => {
    const { isExpanded, isMobileOpen, isHovered} = useSidebar();
    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    // Check if any nested subitem is active
    const hasActiveNestedItem = useCallback((subItems: SubItem[]): boolean => {
        return subItems.some(subItem => {
            if (subItem.path && isActive(subItem.path)) return true;
            if (subItem.subItems) return hasActiveNestedItem(subItem.subItems);
            return false;
        });
    }, [isActive]);

    useEffect(() => {
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    if (hasActiveNestedItem(nav.subItems)) {
                        setOpenSubmenu({
                            type: menuType as "main" | "others",
                            index,
                        });
                        submenuMatched = true;
                    }
                }
            });
        });
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, hasActiveNestedItem]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    return (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                                } cursor-pointer ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                                }`}
                        >
                            <span
                                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                    }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                        ? "rotate-180 text-brand-500"
                                        : ""
                                        }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                    }`}
                            >
                                <span
                                    className={`menu-item-icon-size ${isActive(nav.path)
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                        }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <SubMenuItems
                                items={nav.subItems}
                                level={1}
                                parentKey={`${menuType}-${index}`}
                            />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};