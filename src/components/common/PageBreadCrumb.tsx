import { Link } from "react-router";

interface BreadcrumbRoute {
  path?: string;
  breadcrumbName: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  routes?: BreadcrumbRoute[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, routes }) => {
  const items = routes?.length ? routes : [{ breadcrumbName: pageTitle }];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const key = item.path ?? `${item.breadcrumbName}-${index}`;

            return (
              <li
                key={key}
                className="text-sm text-gray-800 dark:text-white/90"
              >
                {isLast || !item.path ? (
                  <span>{item.breadcrumbName}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                  >
                    {item.breadcrumbName}
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke=""
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
