"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./Attestations.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import AttestationsMasthead from "@/components/attestations_masthead/AttestationsMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import AttestationsLogoArea from "@/components/attestations_masthead/AttestationsLogoArea";
import SetLeftBar from "./SetLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";

const Attestations: React.FC<AttestationsProps> = ({ children }) => {
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
      <AttestationsMasthead
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
            <AttestationsLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
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

export default Attestations;

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
}
