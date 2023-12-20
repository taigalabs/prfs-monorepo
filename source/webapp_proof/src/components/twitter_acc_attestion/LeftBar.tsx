import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { HiPlus } from "@react-icons/all-files/hi/HiPlus";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { usePathname } from "next/navigation";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const LeftBar: React.FC<LeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);
  const pathname = usePathname();
  const name = React.useMemo(() => {
    const segments = pathname.split("/");

    if (segments.length > 2) {
      return segments[2];
    }
    return null;
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.topMenu}>
        <li className={styles.item}>
          <Button
            variant="light_blue_1"
            handleClick={() => {}}
            className={styles.addBtn}
            contentClassName={styles.addBtnContent}
          >
            <HiPlus />
            <span>{i18n.add_attestation}</span>
          </Button>
        </li>
      </ul>
      <ul className={styles.menu}>
        <li className={cn(styles.item, { [styles.isActive]: name === "twitter" })}>
          <Link href={paths.attestations__twitter}>
            <button className={cn(styles.button, { [styles.isActive]: name === "twitter" })}>
              <img
                src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png"
                alt="Twitter"
                crossOrigin=""
              />
              <span>{i18n.x_twitter}</span>
            </button>
          </Link>
        </li>
        <li className={cn(styles.item)}>
          <Link href="">
            <button
              className={cn(styles.button, { [styles.isActive]: name === "linkedin" })}
              disabled
            >
              <FaLinkedin />
              <span>{i18n.linkedin} (Coming later)</span>
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftBar;

export interface LeftBarProps {}
