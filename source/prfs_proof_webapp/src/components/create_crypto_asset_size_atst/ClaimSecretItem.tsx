import React from "react";
import cn from "classnames";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import {
  CommitmentType,
  newPrfsIdMsg,
  API_PATH,
  parseBuffer,
  makeProofGenSearchParams,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
  makeCmCacheKeyQueries,
  WALLET_CACHE_KEY,
  WALLET_CM_STEM,
  EncryptType,
  PRFS_ATTESTATION_STEM,
} from "@taigalabs/prfs-id-sdk-web";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import { sendMsgToChild } from "@taigalabs/prfs-id-sdk-web";
import { secp256k1 } from "@taigalabs/prfs-crypto-js/secp256k1";
import { toHex } from "@taigalabs/prfs-crypto-deps-js/viem";

import styles from "./ClaimSecretItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { useRandomKeyPair, useSessionKey } from "@/hooks/key";
import { envs } from "@/envs";
import {
  AttestationListItem,
  AttestationListItemBtn,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import {
  AttestationStep,
  CLAIM,
  CryptoAssetSizeAtstFormData,
  ENCRYPT_WALLET_ADDR,
  WALLET_ADDR,
} from "./create_crypto_asset_size_atst";

const ClaimSecretItem: React.FC<ClaimSecretItemProps> = ({
  step,
  claimCm,
  setClaimCm,
  formData,
  setWalletCacheKeys,
  setWalletAddrEnc,
  setStep,
}) => {
  const i18n = React.useContext(i18nContext);
  const { sk, pkHex } = useRandomKeyPair();
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { openPopup } = usePopup();
  const claimSecret = React.useMemo(() => {
    const walletAddr = formData[WALLET_ADDR];
    return `${PRFS_ATTESTATION_STEM}${walletAddr}`;
  }, [formData[WALLET_ADDR]]);
  // const priv = secp256k1.utils.randomPrivateKey();
  // const pk = secp256k1.getPublicKey(priv);
  // const session_key = toHex(pk);
  const session_key = useSessionKey();

  const handleClickGenerate = React.useCallback(() => {
    const cacheKeyQueries = makeCmCacheKeyQueries(WALLET_CACHE_KEY, 10, WALLET_CM_STEM);

    const proofGenArgs: ProofGenArgs = {
      nonce: Math.random() * 1000000,
      app_id: "prfs_proof",
      queries: [
        {
          name: CLAIM,
          preImage: claimSecret,
          type: CommitmentType.SIG_POSEIDON_1,
          queryType: QueryType.COMMITMENT,
        },
        ...cacheKeyQueries,
        {
          name: ENCRYPT_WALLET_ADDR,
          msg: formData[WALLET_ADDR],
          type: EncryptType.EC_SECP256K1,
          queryType: QueryType.ENCRYPT,
        },
      ],
      public_key: pkHex,
      session_key,
    };
    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    openPopup(endpoint, async () => {
      if (!prfsEmbed || !isPrfsReady) {
        return;
      }

      const resp = await sendMsgToChild(
        newPrfsIdMsg("REQUEST_PROOF_GEN", { appId: proofGenArgs.app_id }),
        prfsEmbed,
      );
      if (resp) {
        try {
          const buf = parseBuffer(resp);
          let decrypted: string;
          try {
            decrypted = decrypt(sk.secret, buf).toString();
          } catch (err) {
            console.error("cannot decrypt payload", err);
            return;
          }

          let payload: ProofGenSuccessPayload;
          try {
            payload = JSON.parse(decrypted);
          } catch (err) {
            console.error("cannot parse payload", err);
            return;
          }

          const {
            [CLAIM]: cm,
            [ENCRYPT_WALLET_ADDR]: walletAddrEncrypted,
            ...rest
          } = payload.receipt;
          if (cm) {
            setClaimCm(cm);
            setWalletCacheKeys(rest);
            setWalletAddrEnc(walletAddrEncrypted);
            setStep(AttestationStep.POST_TWEET);
          } else {
            console.error("no commitment delivered");
            return;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("Returned val is empty");
      }
    });
  }, [
    formData,
    step,
    claimSecret,
    sk,
    pkHex,
    openPopup,
    setClaimCm,
    setStep,
    setWalletCacheKeys,
    setWalletAddrEnc,
    session_key,
  ]);
  return (
    <AttestationListItem isDisabled={step < AttestationStep.GENERATE_CLAIM}>
      <AttestationListItemOverlay />
      <AttestationListItemNo>2</AttestationListItemNo>
      <AttestationListRightCol>
        <AttestationListItemDesc>
          <AttestationListItemDescTitle>
            {i18n.generate_a_cryptographic_claim}
          </AttestationListItemDescTitle>
          <p>
            {i18n.claim_secret}: {claimSecret}
          </p>
        </AttestationListItemDesc>
        <div className={cn(styles.claimCm)}>
          <AttestationListItemBtn type="button" handleClick={handleClickGenerate}>
            <MdSecurity />
            <span>{i18n.generate}</span>
          </AttestationListItemBtn>
          <p className={cn(styles.value, common.alignItemCenter)}>{claimCm}</p>
        </div>
      </AttestationListRightCol>
    </AttestationListItem>
  );
};

export default ClaimSecretItem;

export interface ClaimSecretItemProps {
  step: AttestationStep;
  claimCm: string | null;
  setClaimCm: React.Dispatch<React.SetStateAction<string | null>>;
  formData: CryptoAssetSizeAtstFormData;
  setWalletCacheKeys: React.Dispatch<React.SetStateAction<Record<string, string> | null>>;
  setWalletAddrEnc: React.Dispatch<React.SetStateAction<string | null>>;
  setStep: React.Dispatch<React.SetStateAction<AttestationStep>>;
}
