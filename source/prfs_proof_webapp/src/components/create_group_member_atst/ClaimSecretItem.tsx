import React from "react";
import cn from "classnames";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import {
  CommitmentType,
  API_PATH,
  makeProofGenSearchParams,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
  makeCmCacheKeyQueries,
  EncryptType,
  createSessionKey,
  openPopup,
  CommitmentReceipt,
  EncryptedReceipt,
  makeGroupMemberAtstClaimSecret,
} from "@taigalabs/prfs-id-sdk-web";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { PrfsAtstGroup } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroup";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";

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
  ENCRYPTED_MEMBER_ID,
  GroupMemberAtstFormData,
  MEMBER_ID,
  MEMBER_ID_CM,
  MEMBER_ID_ENC,
} from "./create_group_member_atst";
import EncryptedMemberIdItem from "./EncryptedMemberIdItem";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";

const ClaimSecretItem: React.FC<MemberCodeInputProps> = ({
  atstGroup,
  formData,
  memberIdCacheKeys,
  setMemberIdCacheKeys,
  handleChangeCm,
  handleChangeMemberIdEnc,
  handleChangeMemberIdCm,
}) => {
  const i18n = React.useContext(i18nContext);
  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();
  const dispatch = useAppDispatch();

  const claimSecret = React.useMemo(() => {
    if (atstGroup && formData[MEMBER_ID]) {
      return makeGroupMemberAtstClaimSecret(atstGroup.atst_group_id, formData[MEMBER_ID]);
    } else {
      return "";
    }
  }, [atstGroup, formData]);

  const cmAbbrev = React.useMemo(() => {
    if (formData[CM]) {
      return abbrev7and5(formData[CM]);
    } else {
      return "";
    }
  }, [formData[CM]]);

  const handleClickGenerate = React.useCallback(async () => {
    if (!atstGroup) {
      return;
    }

    const cacheKeyQueries = makeCmCacheKeyQueries(atstGroup.atst_group_id, 10);
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
        {
          name: MEMBER_ID_CM,
          preImage: formData[MEMBER_ID],
          type: CommitmentType.SIG_POSEIDON_1,
          queryType: QueryType.COMMITMENT,
        },
        ...cacheKeyQueries,
        {
          name: ENCRYPTED_MEMBER_ID,
          msg: formData[MEMBER_ID],
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
  }, [formData, claimSecret, openPrfsIdSession, setSk, setIsPrfsDialogOpen, setSessionKey]);

  const handleSucceedGetSession = React.useCallback(
    (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalMsg({
            variant: "error",
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
          setGlobalMsg({
            variant: "error",
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
          setGlobalMsg({
            variant: "error",
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      const cm: CommitmentReceipt = payload.receipt[CM];
      const memberIdEncrypted: EncryptedReceipt = payload.receipt[ENCRYPTED_MEMBER_ID];
      const memberIdCm: CommitmentReceipt = payload.receipt[MEMBER_ID_CM];
      const {
        [CM]: _cm,
        [ENCRYPTED_MEMBER_ID]: _memberId,
        [MEMBER_ID_CM]: _memberIdCm,
        ...rest
      } = payload.receipt;

      const rest_: Record<string, CommitmentReceipt> = rest;
      const memberIdCacheKeys: Record<string, string> = {};
      for (const key in rest_) {
        memberIdCacheKeys[key] = rest_[key].commitment;
      }

      if (cm?.commitment && memberIdEncrypted?.encrypted && _memberIdCm) {
        setMemberIdCacheKeys(memberIdCacheKeys);
        handleChangeCm(cm.commitment);
        handleChangeMemberIdEnc(memberIdEncrypted.encrypted);
        handleChangeMemberIdCm(memberIdCm.commitment);
      } else {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `No commitment delivered`,
          }),
        );
        return;
      }
    },
    [
      sk,
      dispatch,
      handleChangeCm,
      setMemberIdCacheKeys,
      handleChangeMemberIdEnc,
      handleChangeMemberIdCm,
    ],
  );

  return (
    <>
      <AttestationListItem isDisabled={!atstGroup}>
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
            <p className={cn(styles.value, common.alignItemCenter)}>{cmAbbrev}</p>
          </div>
          {memberIdCacheKeys && (
            <EncryptedMemberIdItem
              memberIdCacheKeys={memberIdCacheKeys}
              memberIdCm={formData[MEMBER_ID_CM]}
              memberIdEnc={formData[MEMBER_ID_ENC]}
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

export interface MemberCodeInputProps {
  atstGroup: PrfsAtstGroup | null;
  handleChangeCm: (val: string) => void;
  formData: GroupMemberAtstFormData;
  memberIdCacheKeys: Record<string, string> | null;
  setMemberIdCacheKeys: React.Dispatch<React.SetStateAction<Record<string, string> | null>>;
  handleChangeMemberIdEnc: (val: string) => void;
  handleChangeMemberIdCm: (val: string) => void;
}
