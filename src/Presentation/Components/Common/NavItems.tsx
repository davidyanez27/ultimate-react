import { BoxCubeIcon, DocsIcon, GridIcon, TableIcon, TimeIcon, UserCircleIcon } from "../../Assets/icons";


import type { NavItem } from "../../types";

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Projects", path: "/", pro: false }],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  {
    icon: <TableIcon />,
    name: "Item Management",
    subItems: [
      { name: "Add/Edit/Delete Items", path: "/profile", pro: false },
      { name: "Item categorization", path: "/user/create", pro: false },
      { name: "Barcodes or QR codes for each item", path: "/users", pro: false },
      { name: "Low-stock alerts", path: "/users", pro: false },
    ]
  },
  {
    icon: <TimeIcon />,
    name: "Inventory Tracking",
    subItems: [
      { name: "Real-time quantity tracking", path: "/profile", pro: false },
      { name: "Batch numbers and expiration dates", path: "/user/create", pro: false },
      { name: "Stock in/out logs", path: "/users", pro: false },
      { name: "Location-based stock", path: "/users", pro: false },

    ]
  },
  {
    icon: <BoxCubeIcon />,
    name: "Suppliers & Vendors",
    subItems: [
      { name: "Add/manage supplier profiles", path: "/profile", pro: false },
      { name: "Associate items with suppliers", path: "/user/create", pro: false },
      { name: "Purchase orders", path: "/users", pro: false },
    ]
  },
  {
    icon: <DocsIcon />,
    name: "Reports & Analytics",
    subItems: [
      { name: "Stock level reports", path: "/profile", pro: false },
      { name: "Inventory value", path: "/user/create", pro: false },
      { name: "Movement trends", path: "/users", pro: false },
      { name: "Export to PDF/Excel", path: "/users", pro: false },
    ]
  },

];

export const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Users",
    subItems: [
      { name: "My Profile", path: "/profile", pro: false },
      { name: "Create User", path: "/user/create", pro: false },
      { name: "My Company", path: "/users", pro: false },
    ]
  },
];