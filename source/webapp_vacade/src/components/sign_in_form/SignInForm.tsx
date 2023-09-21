import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SignInForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>power</div>;
};

export default SignInForm;
