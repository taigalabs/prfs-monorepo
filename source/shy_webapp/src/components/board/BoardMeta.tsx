import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";

import styles from "./BoardMeta.module.scss";
import { useI18N } from "@/i18n/hook";
import Loading from "@/components/loading/Loading";
import Link from "next/link";
import { paths } from "@/paths";

const BoardMeta: React.FC<BoardMetaProps> = ({ channel, noDesc }) => {
  const i18n = useI18N();
  const [isDescOpen, setIsDescOpen] = React.useState(false);
  const handleClickToggleDesc = React.useCallback(() => {
    setIsDescOpen(b => !b);
  }, [setIsDescOpen]);
  const channelUrl = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  const proofTypesElem = React.useMemo(() => {
    if (channel) {
      return channel.proof_type_ids.map(id => (
        <p className={styles.entry} key={id}>
          {id}
        </p>
      ));
    } else return null;
  }, [channel]);

  return channel ? (
    <div className={styles.wrapper}>
      <div className={cn(styles.inner, { [styles.isVisible]: isDescOpen })}>
        <div className={styles.titleRow}>
          <div className={styles.label}>
            <Link href={channelUrl}>{channel.label}</Link>
          </div>
          {!noDesc && (
            <div className={styles.arrow} onClick={handleClickToggleDesc}>
              <IoIosArrowDown />
            </div>
          )}
        </div>
        {!noDesc && (
          <div className={cn(styles.descRow)}>
            <div className={styles.desc}>{channel.desc}</div>
            <div className={styles.proofTypeIds}>
              <p className={styles.title}>{i18n.requiring_proofs_of_type}</p>
              {proofTypesElem}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default BoardMeta;

export interface BoardMetaProps {
  channel: ShyChannel;
  noDesc?: boolean;
}
