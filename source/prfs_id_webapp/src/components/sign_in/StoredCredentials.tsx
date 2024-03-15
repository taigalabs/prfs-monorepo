import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { PASSWORD_2, PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
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
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import { StoredCredentialRecord } from "@/storage/prfs_id_credential";
import {
  EphemeralPrfsIdCredential,
  persistEphemeralPrfsIdCredential,
} from "@/storage/ephe_credential";

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

  React.useEffect(() => {
    if (Object.keys(storedCredentials).length < 1) {
      handleClickUseAnotherId();
    }
  }, [storedCredentials, handleClickUseAnotherId]);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
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
    const password_2 = formData.password_2;
    setErrorMsg("");

    if (credential && password_2) {
      const pw2Bytes = keccak256(toUtf8Bytes(password_2), "bytes");
      const decryptKey = await makeDecryptKey(pw2Bytes);
      const msg = Buffer.from(credential.credential);
      let credentialStr;
      try {
        credentialStr = decrypt(decryptKey.secret, msg).toString();
      } catch (err) {
        console.error(err);
        setErrorMsg("Can't decrypt persisted credential");
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

      persistEphemeralPrfsIdCredential(credentialObj);
      handleSucceedSignIn(credentialObj);
    }
  }, [handleSucceedSignIn, formData, selectedCredentialId, setErrorMsg]);

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        await handleClickNextWithCredential();
      }
    },
    [handleClickNextWithCredential],
  );

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
                    name={PASSWORD_2}
                    error={formErrors[PASSWORD_2]}
                    label={i18n.password_2}
                    value={formData[PASSWORD_2]}
                    handleChangeValue={handleChangeValue}
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
    handleChangeValue,
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
          <DefaultModuleTitle>{i18n.choose_your_idt_to_create_and_own_data}</DefaultModuleTitle>
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
