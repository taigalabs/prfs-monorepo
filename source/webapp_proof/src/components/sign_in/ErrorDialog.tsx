import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { SignInSuccessZAuthMsg } from "@taigalabs/prfs-zauth-interface";

import { paths } from "@/paths";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

const ErrorDialog: React.FC<ErrorDialogProps> = ({ errorMsg, handleClose }) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();

  React.useEffect(() => {}, [searchParams, setStatus]);

  return <div></div>;
};

export default ErrorDialog;

export interface ErrorDialogProps {
  msg: string;
}
