"use client";

import React from "react";
import cn from "classnames";
import { redirect, useRouter } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./SetList.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
// import { MastheadPlaceholder } from "@/components/masthead/Masthead";
// import { useSignedInUser } from "@/hooks/user";
// import AppLogo from "@/components/app_logo/AppLogo";
// import SetsMasthead from "@/components/sets_masthead/SetsMasthead";

const SetList: React.FC<SetListProps> = ({}) => {
  const i18n = React.useContext(i18nContext);
  // const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  // const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  // const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  // const router = useRouter();
  //
  return <div></div>;
};

export default SetList;

export interface SetListProps {}
