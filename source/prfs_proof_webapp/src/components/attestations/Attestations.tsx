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
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";
import AttestationLeftBar from "./AttestationLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInProofUser } from "@/hooks/user";
import { LeftBarContainer } from "@/components/left_bar/LeftBar";
import AppLogo from "@/components/app_logo/AppLogo";
import GlobalErrorDialog from "@/components/global_error_dialog/GlobalErrorDialog";

const Attestations: React.FC<AttestationsProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  const { isInitialized, prfsProofCredential } = useSignedInProofUser();

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

  if (!isInitialized) {
    <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <GlobalErrorDialog />
      <AttestationsMasthead
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <LeftBarContainer isVisible={isLeftBarVisible}>
          <AttestationLeftBar />
        </LeftBarContainer>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <div className={styles.drawerLogoArea}>
            <AppLogo
              handleClickShowLeftBar={handleClickShowLeftBar}
              url={paths.attestations}
              label={i18n.attestations}
            />
          </div>
          <AttestationLeftBar />
        </LeftBarDrawer>
        {children}
      </div>
    </>
  );
};

export default Attestations;

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
}
