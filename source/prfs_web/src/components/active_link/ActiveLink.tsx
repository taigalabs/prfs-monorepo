import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";

import styles from "./ActiveLink.module.scss";

const ActiveLink = ({ children, ...rest }: { children: React.ReactNode } & LinkProps) => {
  const { href } = rest;
  const pathName = usePathname();

  const isActive = pathName.startsWith(href.toString());
  return (
    // you get a global isActive class name, it is better than
    // nothing, but it means you do not have scoping ability in
    // certain cases
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
