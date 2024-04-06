import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";
import { useCachedMemberIdDialog } from "./use_cached_member_id_dialog";

const CachedItemModal: React.FC<CachedItemModalProps> = ({
  handleClickClose,
  handleChangeItem,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const { walletAddrs } = useCachedMemberIdDialog(prfsIdCredential);
  const i18n = React.useContext(i18nContext);

  const addrList = React.useMemo(() => {
    if (walletAddrs) {
      const elems = [];
      for (const addr of walletAddrs) {
        const address = abbrev7and5(addr);
        const handleClick = () => {
          handleChangeItem(addr);
        };

        const el = (
          <li key={addr}>
            <Button variant="white_black_2" className={styles.itemBtn} handleClick={handleClick}>
              {address}
            </Button>
          </li>
        );
        elems.push(el);
      }
      return (
        <div>
          <p className={styles.title}>{i18n.choose_an_address}</p>
          <ul className={styles.itemList}>{elems}</ul>
        </div>
      );
    } else {
      return <div>No cached addresses to select</div>;
    }
  }, [walletAddrs]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      {addrList}
      <div className={styles.btnRow}>
        <div />
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
      </div>
    </div>
  ) : (
    <div>Credential is empty. Something is wrong</div>
  );
};

export default CachedItemModal;

export interface CachedItemModalProps {
  handleClickClose: () => void;
  handleChangeItem: (addr: string) => void;
}
