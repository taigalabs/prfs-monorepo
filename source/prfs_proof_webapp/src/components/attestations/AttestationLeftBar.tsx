import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";
import { usePathname } from "next/navigation";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateAtstPopover from "./CreateAtstPopover";

const TWITTER = "twitter";
const CRYPTO_SIZE = "crypto_size";
const LINKEDIN = "linkedin";

const AttestationLeftBar: React.FC<AttestationLeftBarProps> = () => {
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
          <CreateAtstPopover />
        </li>
      </ul>
      <ul className={styles.menu}>
        <li className={cn(styles.item, { [styles.isHighlighted]: name === TWITTER })}>
          <Link href={paths.attestations__twitter}>
            <button className={cn(styles.button, { [styles.isHighlighted]: name === TWITTER })}>
              <img
                src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png"
                alt="Twitter"
                crossOrigin=""
              />
              <span>{i18n.x_twitter}</span>
            </button>
          </Link>
        </li>
        <li className={cn(styles.item, { [styles.isHighlighted]: name === CRYPTO_SIZE })}>
          <Link href={paths.attestations__crypto_size}>
            <button className={cn(styles.button, { [styles.isHighlighted]: name === CRYPTO_SIZE })}>
              <FaBitcoin />
              <span>{i18n.crypto_asset_size}</span>
            </button>
          </Link>
        </li>
        <li className={cn(styles.item)}>
          <Link href="">
            <button
              className={cn(styles.button, { [styles.isHighlighted]: name === LINKEDIN })}
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

export default AttestationLeftBar;

export interface AttestationLeftBarProps {}
