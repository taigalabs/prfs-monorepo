import React from "react";
import { decrypt, encrypt } from "@taigalabs/prfs-crypto-js";
import { useSearchParams } from "next/navigation";
import { PrfsIdCredential, EncryptQuery, EncryptType } from "@taigalabs/prfs-id-sdk-web";
import { hexlify } from "ethers/lib/utils";

import styles from "./EncryptView.module.scss";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";
import EncryptItem from "./EncryptItem";

const EncryptView: React.FC<EncodeViewProps> = ({ query, credential, setReceipt }) => {
  const searchParams = useSearchParams();
  const [elem, setElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const { name, msg, type } = query;
        if (type === EncryptType.EC_SECP256K1) {
          const encrypted = encrypt(credential.encrypt_key, Buffer.from(msg));
          const encryptedHex = hexlify(encrypted);
          const b = Buffer.from(encryptedHex.substring(2), "hex");
          const c = decrypt(credential.secret_key, b);
          console.log(123, Buffer.from(msg), encrypted, encryptedHex, b, c.toString());

          setReceipt(oldVal => ({
            ...oldVal,
            [name]: encryptedHex,
          }));

          setElem(
            <EncryptItem key={name} name={name} val={msg} type={type} encrypted={encryptedHex} />,
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setElem, query]);

  return <>{elem}</>;
};

export default EncryptView;

export interface EncodeViewProps {
  credential: PrfsIdCredential;
  query: EncryptQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
