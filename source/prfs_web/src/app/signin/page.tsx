import React from "react";
import styles from "./page.module.scss";

const SignIn: React.FC = () => {
  console.log("Home()");

  // let [account, setAccount] = React.useState();
  // React.useEffect(() => {
  //   getSigner().then();
  // }, [setAccount]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.input}>
          <input type="password"></input>
          <button>Sign in</button>
        </div>
        <div>
          <ol>
            <li>123</li>
            <li>123</li>
            <li>123</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
