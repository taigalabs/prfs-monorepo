import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Link from "next/link";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ChannelMeta.module.scss";
import Loading from "@/components/loading/Loading";
import { paths } from "@/paths";

const ChannelMeta: React.FC<BoardMetaProps> = ({ channel, noDesc, noSubChannel, small }) => {
  const i18n = usePrfsI18N();
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
    <div className={cn(styles.wrapper, { [styles.small]: small })}>
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
        {/* {!noSubChannel && <div className={styles.subChannel}>{i18n.general}</div>} */}
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

export default ChannelMeta;

export interface BoardMetaProps {
  channel: ShyChannel;
  noDesc?: boolean;
  noSubChannel?: boolean;
  small?: boolean;
}
