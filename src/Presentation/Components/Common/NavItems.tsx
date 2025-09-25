import { BoxCubeIcon, DocsIcon, GridIcon, TableIcon, TimeIcon, UserCircleIcon } from "../../Assets/icons";


import type { NavItem } from "../../types";

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Dashboard", path: "/", pro: false },
      { name: "Projects", path: "/projects", pro: false }

    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Users",
    subItems: [
      { name: "My Profile", path: "/user/profile", pro: false },
      { name: "Create Users", path: "/user/create", pro: false },
      { name: "My Company", path: "/user/company", pro: false },
    ]

  },
  {
    icon: <TableIcon />,
    name: "Item Management",
    subItems: [
      { 
        name: "Items Management", 
        path: "/items", 
        pro: false,
      //   subItems: [
      //     { name: "Add New Item", path: "/items/add", pro: false },
      //     { name: "Edit Existing Items", path: "/items/edit", pro: false },
      //     { name: "Delete Items", path: "/items/delete", pro: false },
      //     { name: "Bulk Operations", path: "/items/bulk", pro: true },
      //   ]
      },
      { name: "Item categorization", path: "/categories", pro: false },
      { name: "Barcodes or QR codes for each item", path: "/stock/barcodes", pro: false },
      { name: "Low-stock alerts", path: "/stock/alerts", pro: false },
    ]
  },
  {
    icon: <TimeIcon />,
    name: "Inventory Tracking",
    subItems: [
      { name: "Real-time quantity tracking", path: "/profile", pro: false },
      { name: "Batch numbers and expiration dates", path: "/user", pro: false },
      { name: "Stock in/out logs", path: "/users", pro: false },
      { name: "Location-based stock", path: "/users", pro: false },

    ]
  },
  {
    icon: <BoxCubeIcon />,
    name: "Suppliers & Vendors",
    subItems: [
      { name: "Add/manage supplier profiles", path: "/suppliers", pro: false },
      { name: "Associate items with suppliers", path: "/suppliers/items", pro: false },
      { name: "Purchase orders", path: "/suppliers/purchase-orders", pro: false },
    ]
  },
  {
    icon: <DocsIcon />,
    name: "Reports & Analytics",
    subItems: [
      { name: "Stock level reports", path: "/profile", pro: false },
      { name: "Inventory value", path: "/user", pro: false },
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
      { name: "Create User", path: "/user", pro: false },
      { name: "My Company", path: "/company", pro: false },
    ]
  },
];