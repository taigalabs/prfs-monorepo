import React from "react";
import { redirect, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

// import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useAppSelector } from "@/state/hooks";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const dispatch = useDispatch();

  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);
  useLocalWallet(dispatch);

  // React.useEffect(() => {
  //   if (localPrfsAccount) {
  //     router.push(`${paths.c}/crypto`);
  //   } else if (localPrfsAccount === null) {
  //     router.push(`${paths.sign_in}`);
  //   }
  // }, [router, localPrfsAccount]);

  redirect(`${paths.c}/crypto`);

  // return <div>Redirecting...</div>;
};

export default HomePage;
