"use client";

import React from "react";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import Link from "next/link";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";

import styles from "./SearchProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import LogoContainer from "@/components/logo_container/LogoContainer";
import { paths } from "@/paths";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const SearchProofTypeForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const router = useRouter();

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  const handleSelectProofType = React.useCallback(
    async (proofType: PrfsProofType) => {
      router.push(`${paths.create}?proof_type_id=${proofType.proof_type_id}`);
    },
    [getPrfsProofTypeByProofTypeIdRequest, router],
  );

  return (
    <div className={styles.wrapper}>
      <LogoContainer proofTypeChosen={false} />
      <div className={cn({ [styles.formArea]: true, [styles.proofTypeChosen]: !!proofType })}>
        <div
          className={cn({
            [styles.formWrapper]: true,
            [styles.proofTypeChosen]: !!proofType,
          })}
        >
          <div className={styles.proofTypeRow}>
            <TutorialStepper steps={[1]} fullWidth mainAxisOffset={20} crossAxisOffset={15}>
              <SelectProofTypeDialog
                proofType={proofType}
                handleSelectProofType={handleSelectProofType}
                webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
              />
            </TutorialStepper>
          </div>
          <div className={styles.welcomeRow}>
            <span>{i18n.create_and_share_proofs}</span>
            <Link href={`${paths.__}/?tutorial_id=simple_hash`}>How?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProofTypeForm;
