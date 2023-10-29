"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import Link from "next/link";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import PostCreateMenu from "./PostCreateMenu";
import LogoContainer from "@/components/logo_container/LogoContainer";
import { paths } from "@/paths";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import ProofTypeMasthead from "../masthead/ProofTypeMasthead";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const proofTypeId = searchParams.get("proof_type_id");

  React.useEffect(() => {
    async function fn() {
      if (proofTypeId) {
        const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
          proof_type_id: proofTypeId,
        });

        setProofType(payload.prfs_proof_type);
      } else {
      }
    }

    fn().then();
  }, [proofTypeId]);

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

  const handleCreateProofResult = React.useCallback(
    async (err: any, proveReceipt: ProveReceipt | null) => {
      if (err) {
        console.error(err);
      } else if (proveReceipt !== null) {
        setProveReceipt(proveReceipt);
      }
    },
    [setProveReceipt],
  );

  if (!proofTypeId) {
    redirect(paths.__);
  }

  return (
    <>
      <ProofTypeMasthead proofType={proofType} handleSelectProofType={handleSelectProofType} />
      <div className={styles.wrapper}>
        <a href={paths.__}>
          <LogoContainer proofTypeChosen={true} />
        </a>
        <div className={cn({ [styles.formArea]: true, [styles.proofTypeChosen]: !!proofType })}>
          {proveReceipt ? (
            <Fade>
              <PostCreateMenu
                proveReceipt={proveReceipt}
                proofType={proofType!}
                proofGenElement={proofGenElement!}
              />
            </Fade>
          ) : (
            <div
              className={cn({
                [styles.formWrapper]: true,
                [styles.proofTypeChosen]: !!proofType,
              })}
            >
              <div className={styles.proofTypeRow}>
                {/* <TutorialStepper steps={[1]} fullWidth mainAxisOffset={20} crossAxisOffset={15}> */}
                {/*   <SelectProofTypeDialog */}
                {/*     proofType={proofType} */}
                {/*     handleSelectProofType={handleSelectProofType} */}
                {/*     webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT} */}
                {/*   /> */}
                {/* </TutorialStepper> */}
              </div>
              <div className={styles.moduleWrapper}>
                <Fade>
                  {proofType && (
                    <CreateProofModule
                      proofType={proofType}
                      handleCreateProofResult={handleCreateProofResult}
                      proofGenElement={proofGenElement}
                      setProofGenElement={setProofGenElement}
                    />
                  )}
                </Fade>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateProofForm;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}
