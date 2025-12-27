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
    pro?: boolean;
    new?: boolean;
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
        key: "refrence-data-section",
        items: [
            {
                key: "reference-data",
                name: "reference data",
                icon: <GridIcon/>,
                subItems: [
                    {key: "reference-data-destination", name: "destination", icon: <GridIcon/>, path: "/destination",},
                    {key: "reference-data-product-type", name: "product type", icon: <GridIcon/>, path: "/product-type",},
                    {key: "reference-data-service-type", name: "service type", icon: <GridIcon/>, path: "/service-type"},
                    {key: "reference-data-currency", name: "currency", icon: <GridIcon/>, path: "/currency",},
                    {key: "reference-data-contract-status", name: "contract status", icon: <GridIcon/>, path: "/contract-status"},
                    {key: "reference-data-locals", name: "locals", icon: <GridIcon/>, path: "/locals"},
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
                        key: "administration-app-config",
                        name: "app config",
                        icon: <GridIcon/>,
                        path: "/app-config",
                        permissions: ["system_config:read"]
                    },
                ]
            },
        ],
    },

    {
        key: "--",
        items: [
            {
                key: "Dashboard",
                icon: <GridIcon/>,
                name: "Dashboard",
                subItems: [
                    {key: "Ecommerce", name: "Ecommerce", path: "/"},
                    {key: "Analytics", name: "Analytics", path: "/analytics"},
                    {key: "Marketing", name: "Marketing", path: "/marketing"},
                    {key: "CRM", name: "CRM", path: "/crm"},
                    {key: "Stocks", name: "Stocks", path: "/stocks"},
                    {key: "SaaS", name: "SaaS", path: "/saas", new: true},
                    {key: "Logistics", name: "Logistics", path: "/logistics", new: true},
                ],
            },
            {
                key: "AiIcon",
                name: "AI Assistant",
                icon: <AiIcon/>,
                new: true,
                subItems: [
                    {key: "Text Generator", name: "Text Generator", path: "/text-generator"},
                    {key: "Move…", name: "Image Generator", path: "/image-generator"},
                    {key: "Code Generator", name: "Code Generator", path: "/code-generator"},
                    {key: "Video Generator", name: "Video Generator", path: "/video-generator"},
                ],
            },
            {
                key: "E-commerce",
                name: "E-commerce",
                icon: <CartIcon/>,
                new: true,
                subItems: [
                    {key: "Products", name: "Products", path: "/products-list"},
                    {key: "Add Product", name: "Add Product", path: "/add-product"},
                    {key: "Billing", name: "Billing", path: "/billing"},
                    {key: "Invoices", name: "Invoices", path: "/invoices"},
                    {key: "Single Invoice", name: "Single Invoice", path: "/single-invoice"},
                    {key: "Create Invoice", name: "Create Invoice", path: "/create-invoice"},
                    {key: "Transactions", name: "Transactions", path: "/transactions"},
                    {key: "Single Transaction", name: "Single Transaction", path: "/single-transaction"},
                ],
            },
            {
        key: "Calendar",
        icon: <CalenderIcon/>,
        name: "Calendar",
        path: "/calendar",
    },
    {
        key: "profile",
        icon: <UserCircleIcon/>,
        name: "User Profile",
        path: "/profile",
    },
    {
        key: "Task",
        name: "Task",
        icon: <TaskIcon/>,
        subItems: [
            {key: "Kanban", name: "List", path: "/task-list", pro: true},
            {key: "Kanban", name: "Kanban", path: "/task-kanban", pro: true},
        ],
    },
    {
        key: "Forms",
        name: "Forms",
        icon: <ListIcon/>,
        subItems: [
            {key: "form-elements", name: "Form Elements", path: "/form-elements", pro: false},
            {key: "form-layout", name: "Form Layout", path: "/form-layout", pro: true},
        ],
    },
    {
        key: "Basic Tables",
        name: "Tables",
        icon: <TableIcon/>,
        subItems: [
            {key: "Basic Tables", name: "Basic Tables", path: "/basic-tables", pro: false},
            {key: "Data Tables", name: "Data Tables", path: "/data-tables", pro: true},
        ],
    },
    {
        key: "Pages",
        name: "Pages",
        icon: <PageIcon/>,
        subItems: [
            {key: "File Manager", name: "File Manager", path: "/file-manager"},
            {key: "Pricing Tables", name: "Pricing Tables", path: "/pricing-tables"},
            {key: "FAQ", name: "FAQ", path: "/faq"},
            {key: "API Keys", name: "API Keys", path: "/api-keys", new: true},
            {key: "Integrations", name: "Integrations", path: "/integrations", new: true},
            {key: "Blank Page", name: "Blank Page", path: "/blank"},
            {key: "404 Error", name: "404 Error", path: "/error-404"},
            {key: "500 Error", name: "500 Error", path: "/error-500"},
            {key: "503 Error", name: "503 Error", path: "/error-503"},
            {key: "Coming Soon", name: "Coming Soon", path: "/coming-soon"},
            {key: "Maintenance", name: "Maintenance", path: "/maintenance"},
            {key: "Success", name: "Success", path: "/success"},
        ],
    },
        ]
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
