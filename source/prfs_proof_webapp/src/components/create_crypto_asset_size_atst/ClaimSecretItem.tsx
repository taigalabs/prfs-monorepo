import React from "react";
import cn from "classnames";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import {
  CommitmentType,
  API_PATH,
  makeProofGenSearchParams,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
  makeCmCacheKeyQueries,
  WALLET_CACHE_KEY,
  WALLET_CM_STEM,
  EncryptType,
  createSession,
  createSessionKey,
  openPopup,
  makeWalletAtstCmPreImage,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./ClaimSecretItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { useRandomKeyPair } from "@/hooks/key";
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
  const claimSecret = React.useMemo(() => {
    const walletAddr = formData[WALLET_ADDR];
    return makeWalletAtstCmPreImage(walletAddr);
  }, [formData[WALLET_ADDR]]);

  const handleClickGenerate = React.useCallback(async () => {
    const cacheKeyQueries = makeCmCacheKeyQueries(WALLET_CACHE_KEY, 10, WALLET_CM_STEM);
    const session_key = createSessionKey();

    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
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

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    let sessionStream;
    try {
      sessionStream = await createSession({
        key: proofGenArgs.session_key,
        value: null,
        ticket: "TICKET",
      });
    } catch (err) {
      console.error(err);
      return;
    }

    if (!sessionStream) {
      console.error("Couldn't open a session");
      return;
    }

    const { ws, send, receive } = sessionStream;
    const session = await receive();
    if (!session) {
      console.error("Coultn' retreieve session");
      return;
    }

    try {
      if (session.error) {
        console.error(session.error);
        return;
      }

      if (!session.payload) {
        console.error("Session doesn't have a payload");
        return;
      }

      if (session.payload.type !== "put_prfs_id_session_value_result") {
        console.error("Wrong session payload type at this point, msg: %s", session.payload);
        return;
      }

      const buf = Buffer.from(session.payload.value);
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

      const { [CLAIM]: cm, [ENCRYPT_WALLET_ADDR]: walletAddrEncrypted, ...rest } = payload.receipt;
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
  }, [
    formData,
    step,
    claimSecret,
    sk,
    pkHex,
    // openPopup,
    setClaimCm,
    setStep,
    setWalletCacheKeys,
    setWalletAddrEnc,
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
