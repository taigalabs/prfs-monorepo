import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { PASSWORD, PW_PREFIX_LEN, PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { decrypt, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { makeDecryptKey } from "@taigalabs/prfs-crypto-js";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import { keccak256 } from "@taigalabs/prfs-crypto-deps-js/viem";

import styles from "./StoredCredentials.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { IdCreateForm, makeEmptyIDCreateFormErrors, makeEmptyIdCreateForm } from "@/identity";
import { StoredCredentialRecord } from "@/storage/prfs_id_credential";
import {
  EphemeralPrfsIdCredential,
  persistEphemeralPrfsIdCredential,
} from "@/storage/ephe_credential";
import { useSignInPrfsIdentity } from "@/requests";

const MAX_FAIL_COUNT = 3;

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const StoredCredentials: React.FC<StoredCredentialsProps> = ({
  storedCredentials,
  appId,
  handleClickUseAnotherId,
  handleSucceedSignIn,
  handleClickForgetAllCredentials,
  epheCredential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [selectedCredentialId, setSelectedCredentialId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [failCount, setFailCount] = React.useState(0);
  const { mutateAsync: signInPrfsIdentity } = useSignInPrfsIdentity();

  React.useEffect(() => {
    if (Object.keys(storedCredentials).length < 1) {
      handleClickUseAnotherId();
    }
  }, [storedCredentials, handleClickUseAnotherId]);

  React.useEffect(() => {
    if (failCount > MAX_FAIL_COUNT) {
      handleClickForgetAllCredentials();
    }
  }, [failCount]);

  const handleChangePw2Prefix = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name && val.length <= PW_PREFIX_LEN) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  const handleClickEntry = React.useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const dataset = e.currentTarget.dataset;
      if (dataset.id) {
        if (epheCredential?.credential.id === dataset.id) {
          // TODO
          handleSucceedSignIn(epheCredential.credential);
        } else {
          setSelectedCredentialId(dataset.id);
        }
      }
    },
    [storedCredentials, setSelectedCredentialId, epheCredential, handleSucceedSignIn],
  );

  const handleClickNextWithCredential = React.useCallback(async () => {
    const credential = Object.values(storedCredentials).find(
      cred => cred.id === selectedCredentialId,
    );
    const pw2Prefix = formData.password_prefix;
    setErrorMsg("");

    if (credential && pw2Prefix) {
      const pw2PrefixBytes = keccak256(toUtf8Bytes(pw2Prefix), "bytes");
      const decryptKey = await makeDecryptKey(pw2PrefixBytes);
      const msg = Buffer.from(credential.credential);
      let credentialStr;
      try {
        credentialStr = decrypt(decryptKey.secret, msg).toString();
      } catch (err) {
        console.error(err);
        setErrorMsg(
          `Can't decrypt persisted credential. Password may be wrong. \
Failure count: ${failCount}/${MAX_FAIL_COUNT}`,
        );
        setFailCount(c => c + 1);
        return;
      }

      let credentialObj: PrfsIdCredential;
      try {
        credentialObj = JSON.parse(credentialStr);
      } catch (err) {
        console.error(err);
        setErrorMsg("Persisted credential is invalid");
        return;
      }

      if (!credentialObj.id) {
        setErrorMsg(`Persisted credential is corrupted, id: ${credentialObj.id}`);
        return;
      }

      if (!credentialObj.public_key) {
        setErrorMsg(`Persisted credential is corrupted, public_key: ${credentialObj.public_key}`);
        return;
      }

      if (!credentialObj.secret_key) {
        setErrorMsg(`Persisted credential is corrupted, secret_key: ${credentialObj.secret_key}`);
        return;
      }

      if (!credentialObj.encrypt_key) {
        setErrorMsg(
          `Persisted credential is corrupted, encrypted_key: ${credentialObj.encrypt_key}`,
        );
        return;
      }

      if (!credentialObj.local_encrypt_key) {
        setErrorMsg(
          `Persisted credential is corrupted, \
local_encrypt_key: ${credentialObj.local_encrypt_key}`,
        );
        return;
      }

      const { code, error } = await signInPrfsIdentity({
        identity_id: credential.id,
      });

      persistEphemeralPrfsIdCredential(credentialObj);
      handleSucceedSignIn(credentialObj);
    }
  }, [
    failCount,
    handleSucceedSignIn,
    formData,
    selectedCredentialId,
    setErrorMsg,
    signInPrfsIdentity,
    setFailCount,
  ]);

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        await handleClickNextWithCredential();
      }
    },
    [handleClickNextWithCredential],
  );

  const pw2PrefixLabel = React.useMemo(() => {
    return `Starting ${PW_PREFIX_LEN} letters of password 2`;
  }, []);

  const content = React.useMemo(() => {
    const elems = Object.values(storedCredentials).map(cred => {
      let id = "";
      if (cred.id.length > 14) {
        id = abbrev7and5(cred.id);
      } else {
        id = cred.id;
      }

      return (
        <li
          data-id={cred.id}
          key={cred.id}
          className={styles.entry}
          onClick={handleClickEntry}
          role="button"
        >
          <div className={styles.item}>
            <div className={styles.inner}>
              <div className={styles.idRow}>
                <p className={styles.prfsId}>{id}</p>
                {cred.id === epheCredential?.credential.id && (
                  <div className={styles.signedIn}>
                    <FaCheck />
                    <span>{i18n.signed_in}</span>
                  </div>
                )}
              </div>
              {cred.id === selectedCredentialId && (
                <div className={styles.inputArea}>
                  <Input
                    className={styles.input}
                    type="password"
                    name={PASSWORD}
                    error={formErrors[PASSWORD]}
                    label={pw2PrefixLabel}
                    value={formData[PASSWORD]}
                    handleChangeValue={handleChangePw2Prefix}
                    handleKeyDown={handleKeyDown}
                  />
                  <Button
                    className={styles.btn}
                    variant="blue_3"
                    type="button"
                    noTransition
                    handleClick={handleClickNextWithCredential}
                  >
                    {i18n.next}
                  </Button>
                  {errorMsg && <DefaultErrorMsg>{errorMsg}</DefaultErrorMsg>}
                </div>
              )}
            </div>
          </div>
        </li>
      );
    });

    elems.push(
      <li key="sign_in" className={styles.entry} onClick={handleClickUseAnotherId} role="button">
        <div className={styles.item}>
          <div className={cn(styles.inner, styles.idRow)}>
            <p className={styles.useAnotherId}>{i18n.use_another_id}</p>
          </div>
        </div>
      </li>,
    );

    return <ul className={styles.credList}>{elems}</ul>;
  }, [
    selectedCredentialId,
    formData,
    handleChangePw2Prefix,
    handleClickNextWithCredential,
    errorMsg,
    handleClickUseAnotherId,
    epheCredential,
  ]);

  const subtitle = React.useMemo(() => {
    return `${i18n.to_continue_to} ${appId}`;
  }, [appId]);

  return (
    <>
      <DefaultInnerPadding noSidePadding>
        <DefaultModuleHeader noTopPadding>
          <DefaultModuleTitle>{i18n.choose_your_id_to_create_data}</DefaultModuleTitle>
          <DefaultModuleSubtitle>{subtitle}</DefaultModuleSubtitle>
        </DefaultModuleHeader>
        {content}
      </DefaultInnerPadding>
      <DefaultModuleBtnRow className={styles.btnRow}>
        <Button
          variant="transparent_blue_3"
          rounded
          noTransition
          handleClick={handleClickForgetAllCredentials}
          type="button"
        >
          {i18n.forget_all_accounts}
        </Button>
        <div />
      </DefaultModuleBtnRow>
    </>
  );
};

export default StoredCredentials;

export interface StoredCredentialsProps {
  storedCredentials: StoredCredentialRecord;
  appId: string;
  handleClickUseAnotherId: () => void;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  handleClickForgetAllCredentials: () => void;
  epheCredential: EphemeralPrfsIdCredential | null;
}
