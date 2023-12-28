"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useSearchParams } from "next/navigation";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/elems/proof_gen_element/proof_gen_element";

import styles from "./CreateProofForm.module.scss";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import PostCreateMenu from "./PostCreateMenu";
import ProofTypeMasthead from "@/components/proof_type_masthead/ProofTypeMasthead";
import { useSelectProofType } from "@/hooks/proofType";
import Tutorial from "@/components/tutorial/Tutorial";
import LeftPadding from "@/components/left_padding/LeftPadding";
import { MastheadPlaceholder } from "../masthead/Masthead";

const CreateProofForm: React.FC = () => {
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const proofTypeIdRef = React.useRef<string | null>(null);
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);
  const searchParams = useSearchParams();
  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      const proofTypeId = searchParams.get("proof_type_id");

      if (proofTypeId) {
        if (proofTypeIdRef.current && proofTypeIdRef.current !== proofTypeId) {
          setProveReceipt(undefined);
        }
        proofTypeIdRef.current = proofTypeId;

        const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
          proof_type_id: proofTypeId,
        });

        if (payload) {
          setProofType(payload.prfs_proof_type);
        }
      } else {
      }
    }

    fn().then();
  }, [searchParams, proofTypeIdRef, setProveReceipt]);

  const handleSelectProofType = useSelectProofType();

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

  return (
    <>
      <ProofTypeMasthead
        proofInstanceId={undefined}
        proofType={proofType}
        handleSelectProofType={handleSelectProofType}
      />
      <MastheadPlaceholder twoColumn />
      <div className={styles.topRow}></div>
      <div className={styles.main}>
        <LeftPadding />
        {proofType ? (
          <div
            className={cn({
              [styles.formWrapper]: true,
            })}
          >
            {proveReceipt ? (
              <Fade>
                <PostCreateMenu
                  proveReceipt={proveReceipt}
                  proofType={proofType!}
                  proofGenElement={proofGenElement!}
                />
              </Fade>
            ) : (
              <Fade>
                <CreateProofModule
                  proofType={proofType}
                  handleCreateProofResult={handleCreateProofResult}
                  proofGenElement={proofGenElement}
                  setProofGenElement={setProofGenElement}
                />
              </Fade>
            )}
          </div>
        ) : (
          <div className={styles.loading}>Loading module...</div>
        )}
        <Tutorial noTop />
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