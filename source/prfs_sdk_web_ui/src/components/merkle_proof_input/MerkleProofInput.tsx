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
import { GetAddressMsg, GetSignatureMsg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

import styles from "./MerkleProofInput.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";
import WalletSelect, { WalletTypeValue } from "@/components/wallet_select/WalletSelect";

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({ input, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  console.log(111, input);

  const handleClickCreate = React.useCallback(async () => {
    // if (value) {
    //   await sendMsgToParent(new GetSignatureMsg(value.msgHash));
    // }
  }, [value, setFormValues]);

  const createBase = React.useCallback((isOpen: boolean) => {
    console.log(11, isOpen);

    return (
      <button
        className={cn({
          [styles.createBtn]: true,
          [styles.isOpen]: isOpen,
        })}
        onClick={handleClickCreate}
      >
        {i18n.create}
      </button>
    );
  }, []);

  const popoverElem = <div className={styles.popoverWrapper}>powepo</div>;

  return (
    <div className={styles.wrapper}>
      <input placeholder={input.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <Popover createBase={createBase} popoverElem={popoverElem} />
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
