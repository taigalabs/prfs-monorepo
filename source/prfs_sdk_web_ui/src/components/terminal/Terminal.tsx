import React from "react";
import { RiArrowUpSLine } from "react-icons/ri";

import styles from "./Terminal.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Terminal: React.FC<TerminalProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const logRef = React.useRef<HTMLDivElement>(null);

  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    console.log(123);
    // setOpacity(1);
  }, [setOpacity]);

  React.useEffect(() => {
    // logRef.current?.scrollIntoView({
    //   behavior: "smooth",
    // });
    //
    // console.log(123);
    // setOpacity(1);
  }, [logRef]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {/* <div> */}
        {/*   <RiArrowUpSLine /> */}
        {/* </div> */}
        {/* <div>{i18n.terminal_scroll_guide}</div> */}
      </div>
      <div ref={logRef} className={styles.log}>
        {children}
      </div>
    </div>
  );
};

export default Terminal;

export interface TerminalProps {
  children: React.ReactNode;
}
