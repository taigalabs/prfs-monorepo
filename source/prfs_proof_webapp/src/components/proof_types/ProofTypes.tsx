"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import ProofTypeLeftBar from "./ProofTypeLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";
import { LeftBarContainer } from "@/components/left_bar/LeftBar";
import AppLogo from "@/components/app_logo/AppLogo";
import ProofTypeMasthead from "./ProofTypeMasthead";

const ProofTypes: React.FC<ProofTypesProps> = ({ children }) => {
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
      <ProofTypeMasthead
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <LeftBarContainer isVisible={isLeftBarVisible}>
          <ProofTypeLeftBar />
        </LeftBarContainer>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <div className={styles.drawerLogoArea}>
            <AppLogo
              handleClickShowLeftBar={handleClickShowLeftBar}
              url={paths.attestations}
              label={i18n.attestations}
            />
          </div>
          <ProofTypeLeftBar />
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

export default ProofTypes;

export interface ProofTypesProps {
  children: React.ReactNode;
  className?: string;
}
