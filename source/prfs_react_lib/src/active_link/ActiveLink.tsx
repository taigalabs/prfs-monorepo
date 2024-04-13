import React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";

import styles from "./ActiveLink.module.scss";

const ActiveLink = ({
  children,
  href,
  exact,
  activeClassName,
  className,
}: ActiveLinkProps & LinkProps) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const isActive = exact ? pathname === href.toString() : pathname.startsWith(href.toString());

    setIsActive(isActive);
  }, [pathname, setIsActive]);

  return (
    <Link
      className={cn(styles.wrapper, className, {
        [styles.active]: isActive,
        [activeClassName || ""]: isActive,
      })}
      href={href}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;

export type ActiveLinkProps = LinkProps & {
  exact?: boolean;
  children: React.ReactNode;
  activeClassName?: string;
  className?: string;
};

// type ActiveLinkProps = LinkProps & {
//   className?: string;
//   activeClassName: string;
// };
