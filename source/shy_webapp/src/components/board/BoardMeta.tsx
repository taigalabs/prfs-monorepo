import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";

import styles from "./BoardMeta.module.scss";
import { useI18N } from "@/i18n/hook";
import Button from "@/components/button/Button";
import Loading from "../loading/Loading";
import { Spinner } from "@phosphor-icons/react";

const BoardMeta: React.FC<BoardMetaProps> = ({ channelId }) => {
  const i18n = useI18N();
  const { data, error, isFetching } = useQuery({
    queryKey: ["get_shy_channel"],
    queryFn: async () => {
      return shyApi2({ type: "get_shy_channel", channel_id: channelId });
    },
  });
  const [isDescOpen, setIsDescOpen] = React.useState(false);
  const handleClickToggleDesc = React.useCallback(() => {
    setIsDescOpen(b => !b);
  }, [setIsDescOpen]);

  const channel = data?.payload?.shy_channel;
  const proofTypesElem = React.useMemo(() => {
    if (channel) {
      return channel.proof_type_ids.map(id => (
        <p className={styles.entry} key={id}>
          {id}
        </p>
      ));
    } else return null;
  }, [channel]);

  if (error) {
    return <div>Error has occurred</div>;
  }

  return channel ? (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.titleRow}>
          <div className={styles.label}>{channel.label}</div>
          <div className={styles.arrow} onClick={handleClickToggleDesc}>
            <IoIosArrowDown />
          </div>
        </div>
        {isDescOpen && (
          <>
            <div className={styles.desc}>{channel.desc}</div>
            <div className={styles.proofTypeIds}>
              <p className={styles.title}>Requiring proofs of types</p>
              {proofTypesElem}
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default BoardMeta;

export interface BoardMetaProps {
  channelId: string;
}
