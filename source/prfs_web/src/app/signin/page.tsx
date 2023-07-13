import React from "react";
import styles from "./page.module.css";

export default function SignIn() {
  console.log("Home()");

  // let [account, setAccount] = React.useState();
  // React.useEffect(() => {
  //   getSigner().then();
  // }, [setAccount]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.input}>
        <input type="password"></input>
      </div>
    </div>
  );
}
