import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./CachedItemModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";
import { useCachedItems } from "./use_cached_items";

const CachedItemModal: React.FC<CachedItemModalProps> = ({
  prfsSet,
  handleClickClose,
  handleChangeItem,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const { items } = useCachedItems({ prfsIdCredential, prfsSet });
  const i18n = React.useContext(i18nContext);

  const elems = React.useMemo(() => {
    if (items) {
      const elems = [];
      for (const item of items) {
        const itemAbbrev = item.length > 12 ? abbrev7and5(item) : item;
        const handleClick = () => {
          handleChangeItem(itemAbbrev);
        };

        const el = (
          <li key={itemAbbrev}>
            <Button variant="white_black_2" className={styles.itemBtn} handleClick={handleClick}>
              {itemAbbrev}
            </Button>
          </li>
        );
        elems.push(el);
      }
      return (
        <div>
          <p className={styles.title}>{i18n.choose_a_cached_item}</p>
          <ul className={styles.itemList}>{elems}</ul>
        </div>
      );
    } else {
      return <div>No cached addresses to select</div>;
    }
  }, [items]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      {elems}
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
  prfsSet: PrfsSet;
  handleClickClose: () => void;
  handleChangeItem: (addr: string) => void;
}
