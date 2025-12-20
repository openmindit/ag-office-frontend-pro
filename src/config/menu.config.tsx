import {
  AiIcon,
  BoxCubeIcon,
  CalenderIcon,
  CallIcon,
  CartIcon,
  ChatIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  MailIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons";


export type NavItem = {
    key: string;
    name: string;
    icon?: React.ReactNode;
    path?: string;
    permissions?: string[];
    subItems?: NavItem[];
};

export type MenuSection = {
    key: string;
    label?: string;
    items: NavItem[];
};

export const MENU_SECTIONS: MenuSection[] = [
    {
        key: "follow-up-label",
        items: [
            {
                key: "follow-up",
                name: "follow up",
                icon: <GridIcon/>,
                subItems: [
                    {key: "follow-up-dashboard", name: "dashboard", icon: <GridIcon/>, path: "/",},
                    {key: "follow-up-tasks", name: "tasks", icon: <GridIcon/>},
                    {key: "follow-up-reminders", name: "reminders", icon: <GridIcon/>},
                    {key: "follow-up-calendar", name: "calendar", icon: <GridIcon/>, path: "/calendar",},
                    {key: "follow-up-kanbans", name: "kanbans", icon: <GridIcon/>},
                ]
            },
        ],
    },
    {
        key: "catalogue",
        label: "Catalogue",
        items: [
            {
                key: "suppliers",
                name: "suppliers",
                icon: <GridIcon/>,
                path: "/suppliers",
                permissions: ["suppliers:read"]
            },
            {key: "products", name: "products", icon: <GridIcon/>, path: "/products", permissions: ["products:read"]},
            {
                key: "contracts",
                name: "contracts",
                icon: <GridIcon/>,
                path: "/contracts",
                permissions: ["contracts:read"]
            },
            {key: "packages", name: "packages", icon: <GridIcon/>, path: "/packages", permissions: ["packages:read"]},
        ],
    },
    {
        key: "sales",
        label: "Sales",
        items: [
            {key: "sales-clients", name: "clients", icon: <GridIcon/>, path: "/clients"},
            {key: "sales-cases", name: "booking files", icon: <GridIcon/>, path: "/cases"},
            {key: "sales-quotes", name: "quotes", icon: <GridIcon/>, path: "/quotes"},
            {key: "sales-bookings", name: "bookings", icon: <GridIcon/>, path: "/bookings"},
            {key: "sales-vouchers", name: "vouchers", icon: <GridIcon/>, path: "/vouchers"},
        ],
    },

    {
        key: "settings-label",
        items: [
            {
                key: "settings",
                name: "settings",
                icon: <GridIcon/>,
                subItems: [
                    {key: "settings-profile", name: "profile", icon: <GridIcon/>, path: "/profile",},
                    {key: "settings-configuration", name: "configuration", icon: <GridIcon/>, path: "/config",},
                ]
            },
        ],
    },
    {
        key: "administration-label",
        items: [
            {
                key: "administration",
                name: "administration",
                icon: <GridIcon/>,
                subItems: [
                    {
                        key: "administration-users",
                        name: "users",
                        icon: <GridIcon/>,
                        path: "/users",
                        permissions: ["users:read"]
                    },
                    {
                        key: "administration-roles",
                        name: "roles",
                        icon: <GridIcon/>,
                        path: "/roles",
                        permissions: ["roles:read"]
                    },
                    {
                        key: "administration-permissions",
                        name: "permissions",
                        icon: <GridIcon/>,
                        path: "/permissions",
                        permissions: ["permissions:read"]
                    },
                    {
                        key: "administration-ressources",
                        name: "ressources",
                        icon: <GridIcon/>,
                        path: "/ressources",
                        permissions: ["ressources:read"]
                    },
                ]
            },
        ],
    },
    {
        key: "others",
        items: [
            {
                key: "exemples",
                name: "Exemples",
                icon: <PieChartIcon/>,
                subItems: [
                    {
                        key: "dashboard",
                        name: "Dashboard",
                        icon: <GridIcon/>,
                        subItems: [{key: "dashboard-home", name: "Home", path: "/"}],
                    },
                    {
                        key: "calendar",
                        name: "Calendar",
                        icon: <CalenderIcon/>,
                        path: "/calendar",
                        permissions: ["calendar:read"],
                    },
                    {
                        key: "profile",
                        name: "User Profile",
                        icon: <UserCircleIcon/>,
                        path: "/profile",
                    },
                    {key: "chart-line", name: "Line Chart", path: "/line-chart"},
                    {key: "chart-bar", name: "Bar Chart", path: "/bar-chart"},
                ],
            },
        ],
    },
];
