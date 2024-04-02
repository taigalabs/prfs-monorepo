import React from "react";
import cn from "classnames";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
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
  // createSession,
  createSessionKey,
  openPopup,
  makeAtstCmPreImage,
  CommitmentReceipt,
  EncryptedReceipt,
} from "@taigalabs/prfs-id-sdk-web";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import styles from "./ClaimSecretItem.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
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
  CM,
  CryptoAssetSizeAtstFormData,
  ENCRYPT_WALLET_ADDR,
  WALLET_ADDR,
} from "./create_crypto_asset_atst";
import EncryptedWalletAddrItem from "./EncryptedWalletAddrItem";
import { useAppDispatch } from "@/state/hooks";

const ClaimSecretItem: React.FC<ClaimSecretItemProps> = ({
  formData,
  handleChangeCm,
  walletCacheKeys,
  walletAddrEnc,
  setWalletCacheKeys,
  setWalletAddrEnc,
}) => {
  const i18n = React.useContext(i18nContext);
  const { openPrfsIdSession, isPrfsDialogOpen, setIsPrfsDialogOpen, sessionKey, setSessionKey } =
    usePrfsIdSession();
  const [sk, setSk] = React.useState<PrivateKey | null>(null);
  const dispatch = useAppDispatch();
  const claimSecret = React.useMemo(() => {
    const walletAddr = formData[WALLET_ADDR];
    return makeAtstCmPreImage(walletAddr);
  }, [formData[WALLET_ADDR]]);

  const handleClickGenerate = React.useCallback(async () => {
    const cacheKeyQueries = makeCmCacheKeyQueries(WALLET_CACHE_KEY, 10, WALLET_CM_STEM);
    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();

    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "prfs_proof",
      queries: [
        {
          name: CM,
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

    const { payload: _ } = await openPrfsIdSession({
      key: proofGenArgs.session_key,
      value: null,
      ticket: "TICKET",
    });
    setIsPrfsDialogOpen(true);
    setSessionKey(proofGenArgs.session_key);
    setSk(sk);
  }, [
    formData,
    claimSecret,
    handleChangeCm,
    setWalletCacheKeys,
    setWalletAddrEnc,
    openPrfsIdSession,
    setSk,
    setIsPrfsDialogOpen,
    setSessionKey,
  ]);

  const handleSucceedGetSession = React.useCallback(
    (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalError({
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot decrypt payload, err: ${err}`,
          }),
        );
        return;
      }

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      const cm: CommitmentReceipt = payload.receipt[CM];
      const walletAddrEncrypted: EncryptedReceipt = payload.receipt[ENCRYPT_WALLET_ADDR];
      const { [CM]: _cm, [ENCRYPT_WALLET_ADDR]: _enc, ...rest } = payload.receipt;

      const rest_: Record<string, CommitmentReceipt> = rest;
      const walletCacheKeys: Record<string, string> = {};
      for (const key in rest_) {
        walletCacheKeys[key] = rest_[key].commitment;
      }

      if (cm?.commitment && walletAddrEncrypted?.encrypted) {
        handleChangeCm(cm.commitment);
        setWalletCacheKeys(walletCacheKeys);
        setWalletAddrEnc(walletAddrEncrypted.encrypted);
      } else {
        dispatch(
          setGlobalError({
            message: `No commitment delivered`,
          }),
        );
        return;
      }
    },
    [sk, dispatch],
  );

  return (
    <>
      <AttestationListItem isDisabled={formData[WALLET_ADDR]?.length === 0}>
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
            <p className={cn(styles.value, common.alignItemCenter)}>{formData[CM]}</p>
          </div>
          {walletCacheKeys && (
            <EncryptedWalletAddrItem
              walletCacheKeys={walletCacheKeys}
              walletAddrEnc={walletAddrEnc}
            />
          )}
        </AttestationListRightCol>
      </AttestationListItem>
      <PrfsIdSessionDialog
        sessionKey={sessionKey}
        isPrfsDialogOpen={isPrfsDialogOpen}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedGetSession}
      />
    </>
  );
};

export default ClaimSecretItem;

export interface ClaimSecretItemProps {
  handleChangeCm: (cm: string) => void;
  formData: CryptoAssetSizeAtstFormData;
  setWalletCacheKeys: React.Dispatch<React.SetStateAction<Record<string, string> | null>>;
  setWalletAddrEnc: React.Dispatch<React.SetStateAction<string | null>>;
  walletCacheKeys: Record<string, string> | null;
  walletAddrEnc: string | null;
}
