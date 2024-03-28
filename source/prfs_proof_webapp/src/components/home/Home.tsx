"use client";

import React from "react";
import cn from "classnames";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import SearchProofDialog from "@taigalabs/prfs-react-lib/src/search_proof_dialog/SearchProofDialog";
import { inter } from "@taigalabs/prfs-react-lib/src/fonts";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./Home.module.scss";
import { i18nContext } from "@/i18n/context";
import TitleArea from "./TitleArea";
import { paths } from "@/paths";
import TutorialArea from "./TutorialArea";
import { roboto } from "@/fonts";
import CallToAction from "./CallToAction";
import FeatureList from "./FeatureList";
import Specialties from "./Specialties";
import ProjectStatus from "./ProjectStatus";
import Contacts from "./Contacts";
import FeaturedApps from "./FeaturedApps";

enum SearchProofTypeFormStatus {
  Standby,
  Loading,
}

const Home: React.FC<HomeProps> = () => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formStatus, setFormStatus] = React.useState(SearchProofTypeFormStatus.Standby);
  const [isSearchBarFocused, setIsSearchBarFocused] = React.useState(false);

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi3({ type: "get_prfs_proof_type_by_proof_type_id", ...req });
    },
  });

  const handleSelectProofType = React.useCallback(
    async (proofType: PrfsProofType) => {
      setFormStatus(SearchProofTypeFormStatus.Loading);
      const params = searchParams.toString();
      router.push(`${paths.create}?proof_type_id=${proofType.proof_type_id}&${params}`);
    },
    [getPrfsProofTypeByProofTypeIdRequest, router, searchParams, setFormStatus],
  );

  const handleFocusSearchBar = React.useCallback(() => {
    setIsSearchBarFocused(true);

    window.setTimeout(() => {
      setIsSearchBarFocused(false);
    }, 1000);
  }, [setIsSearchBarFocused]);

  return (
    <>
      <div className={cn(styles.wrapper, inter.className)}>
        <TitleArea />
        <div className={cn(styles.formArea)}>
          {formStatus === SearchProofTypeFormStatus.Loading && (
            <div className={styles.overlay}>
              <Spinner size={32} color="#8a8c8c" />
            </div>
          )}
          <div className={cn(styles.formWrapper, { [styles.isFocused]: isSearchBarFocused })}>
            <div className={styles.proofTypeRow}>
              <SearchProofDialog
                className={cn(roboto.className, styles.searchBar)}
                proofType={undefined}
                handleSelectProofType={handleSelectProofType}
                webappConsoleEndpoint={process.env.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}
              />
            </div>
          </div>
        </div>
        <CallToAction />
        <FeatureList handleFocusSearchBar={handleFocusSearchBar} />
        <FeaturedApps />
        <TutorialArea />
        <Specialties />
        <ProjectStatus />
        <Contacts />
      </div>
    </>
  );
};

export default Home;

export interface HomeProps {}
