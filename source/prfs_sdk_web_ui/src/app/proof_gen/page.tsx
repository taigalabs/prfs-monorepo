import React from "react";
import { useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Msg, PRFS_SDK_MSG } from "@taigalabs/prfs-sdk-web";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import useLocalWallet from "@/hooks/useLocalWallet";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";

const ProofGen: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const signer = useSigner();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    window.addEventListener("message", e => {
      console.log("parent says", e.data);
      setData(e.data);
    });

    setTimeout(() => {
      window.parent.postMessage(
        {
          data: "afaf",
        },
        "*"
      );
    }, 1000);

    // console.log(33, window.ethereum);

    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  }, [setData]);

  return (
    <div>
      123123
      <div>{data}</div>
    </div>
  );
  // return <CreateProofForm />;
};

export default ProofGen;
