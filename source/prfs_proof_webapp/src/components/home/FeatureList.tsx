import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Link from "next/link";

import styles from "./FeatureList.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Title } from "./IntroComponents";

const FeatureList: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area>
      <Title>{i18n.features_for_safer_internet}</Title>
      <ul>
        <li>{i18n.proof}</li>
        <li>{i18n.attestation}</li>
      </ul>
    </Area>
  );
};

export default FeatureList;

export interface LogoContainerProps {}
