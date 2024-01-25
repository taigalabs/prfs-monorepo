"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./Sets.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import SetLeftBar from "./SetLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";
import AppLogo from "@/components/app_logo/AppLogo";
import SetsMasthead from "@/components/sets_masthead/SetsMasthead";

const Sets: React.FC<SetsProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isCredentialInitialized) {
      if (prfsProofCredential === null) {
        router.push(paths.accounts);
      }
    }
  }, [isCredentialInitialized, prfsProofCredential, router]);

  const handleClickShowLeftBar = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarVisible(open);
      } else {
        setIsLeftBarVisible(v => !v);
      }
    },
    [setIsLeftBarVisible],
  );

  const handleClickShowLeftBarDrawer = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarDrawerVisible(open);
      } else {
        setIsLeftBarDrawerVisible(v => !v);
      }
    },
    [setIsLeftBarDrawerVisible],
  );

  if (!isCredentialInitialized) {
    <div className={styles.loading}>Loading...</div>;
  }

  return prfsProofCredential ? (
    <>
      <SetsMasthead
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <div className={cn(styles.leftBarContainer, { [styles.isVisible]: isLeftBarVisible })}>
          <SetLeftBar />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <div className={styles.drawerLogoArea}>
            <AppLogo
              handleClickShowLeftBar={handleClickShowLeftBar}
              url={paths.sets}
              label={i18n.sets}
            />
          </div>
          <SetLeftBar />
        </LeftBarDrawer>
        {children}
      </div>
    </>
  ) : (
    <div className={styles.loading}>
      <Spinner size={32} color={colors.gray_32} />
    </div>
  );
};

export default Sets;

export interface SetsProps {
  children: React.ReactNode;
  className?: string;
}
