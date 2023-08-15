import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PiCalculatorLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import {
  GetAddressMsg,
  GetSignatureMsg,
  ListenClickOutsideMsg,
  MsgType,
  StopClickOutsideMsg,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { PROOF_GEN_IFRAME_ID } from "@taigalabs/prfs-sdk-web";

import styles from "./MerkleProofInput.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";
import WalletSelect, { WalletTypeValue } from "@/components/wallet_select/WalletSelect";
import { PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/click";

const MerkleProofModal: React.FC<MerkleProofModalProps> = ({ setIsOpen }) => {
  React.useEffect(() => {
    async function fn() {
      sendMsgToParent(new ListenClickOutsideMsg());

      window.addEventListener("message", (ev: MessageEvent) => {
        const { type } = ev.data;

        if (type && type === PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE) {
          setIsOpen(false);
        }
      });
    }

    fn().then();

    return () => {
      sendMsgToParent(new StopClickOutsideMsg());
    };
  }, []);

  return <div className={styles.popoverWrapper}>pp</div>;
};

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({ input, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  const handleClickCreate = React.useCallback(async () => {
    console.log("handle click");
  }, [value, setFormValues]);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div>
        <button
          className={cn({
            [styles.createBtn]: true,
            [styles.isOpen]: isOpen,
          })}
          onClick={handleClickCreate}
        >
          {i18n.create}
        </button>
      </div>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return <MerkleProofModal setIsOpen={setIsOpen} />;
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <input placeholder={input.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <button className={styles.rawBtn}>Raw</button>
        <Popover createBase={createBase} createPopover={createPopover} />
      </div>
    </div>
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  input: CircuitInput;
  value: any | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
