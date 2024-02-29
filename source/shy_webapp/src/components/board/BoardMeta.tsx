import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";

import styles from "./BoardMeta.module.scss";
import { useI18N } from "@/i18n/hook";
import Loading from "@/components/loading/Loading";

const BoardMeta: React.FC<BoardMetaProps> = ({ channel }) => {
  const i18n = useI18N();
  const [isDescOpen, setIsDescOpen] = React.useState(false);
  const handleClickToggleDesc = React.useCallback(() => {
    setIsDescOpen(b => !b);
  }, [setIsDescOpen]);

  const proofTypesElem = React.useMemo(() => {
    if (channel) {
      return channel.proof_type_ids.map(id => (
        <p className={styles.entry} key={id}>
          {id}
        </p>
      ));
    } else return null;
  }, [channel]);

  const desc = React.useMemo(() => {
    if (isDescOpen) {
      return channel.desc;
    } else {
      return channel.desc.substring(0, 45) + "...";
    }
  }, [channel.desc, isDescOpen]);

  return channel ? (
    <div className={styles.wrapper}>
      <div className={cn(styles.inner, { [styles.isVisible]: isDescOpen })}>
        <div className={styles.titleRow}>
          <div className={styles.label}>{channel.label}</div>
          <div className={styles.arrow} onClick={handleClickToggleDesc}>
            <IoIosArrowDown />
          </div>
        </div>
        <div className={cn(styles.descRow)}>
          <div className={styles.desc}>{desc}</div>
          <div className={styles.proofTypeIds}>
            <p className={styles.title}>{i18n.requiring_proofs_of_type}</p>
            {proofTypesElem}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default BoardMeta;

export interface BoardMetaProps {
  channel: ShyChannel;
}
