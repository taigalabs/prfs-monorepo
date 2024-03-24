import React from "react";
import cn from "classnames";

import styles from "./PLogo.module.scss";
import AppLogo from "../app_logo/AppLogo";

const PLogo: React.FC<LogoProps> = ({ className, width }) => {
  return (
    <AppLogo
      imgUrl="https://d1w1533jipmvi2.cloudfront.net/logo_p_lato_192.png"
      alt="Prfs Id"
      width={width}
    />
  );
};

export default PLogo;

export interface LogoProps {
  className?: string;
  width?: number;
}
