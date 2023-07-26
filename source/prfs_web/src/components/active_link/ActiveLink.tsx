import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";

import styles from "./ActiveLink.module.scss";

const ActiveLink = ({ children, ...rest }: { children: React.ReactNode } & LinkProps) => {
  const { href } = rest;
  const pathName = usePathname();

  const isActive = pathName.startsWith(href.toString());

  return (
    <Link
      className={classnames({
        [styles.wrapper]: true,
        [styles.active]: isActive,
      })}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
