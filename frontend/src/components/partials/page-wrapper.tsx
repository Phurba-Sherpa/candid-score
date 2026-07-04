import type { ReactNode } from "react";

type PageWrapperProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerAction?: ReactNode;
};
const PageWrapper = ({
  title,
  subtitle,
  headerAction,
  children,
}: PageWrapperProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-b-[#ebebeb] pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-2xl  font-semibold mb-2">{title}</h2>
            <p className="text-primary-text-light text-sm max-w-[100ch]">
              {subtitle}
            </p>
          </div>
          {headerAction}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default PageWrapper;
