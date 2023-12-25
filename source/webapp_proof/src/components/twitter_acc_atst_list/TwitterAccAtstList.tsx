import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { decrypt } from "eciesjs";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CommitmentType,
  PrfsIdCommitmentSuccessPayload,
  PrfsIdMsg,
  getCommitment,
  makeAttestation,
  newPrfsIdMsg,
} from "@taigalabs/prfs-id-sdk-web";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import colors from "@taigalabs/prfs-react-components/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { TwitterAccValidation } from "@taigalabs/prfs-entities/bindings/TwitterAccValidation";

import styles from "./CreateTwitterAccAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { paths } from "@/paths";

enum Status {
  Standby,
  InProgress,
}

const TwitterAccAtstList: React.FC<TwitterAccAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { mutateAsync: attestTwitterAccRequest } = useMutation({
    mutationFn: (req: AttestTwitterAccRequest) => {
      return atstApi("attest_twitter_acc", req);
    },
  });

  React.useEffect(() => {}, []);

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.create_twitter_acc_attestation}
      </AttestationsTitle>
      wer
    </>
  );
};

export default TwitterAccAtstList;

export interface TwitterAccAtstListProps {}
