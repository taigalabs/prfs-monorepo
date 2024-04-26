import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";

import styles from "./EncryptedMemberId.module.scss";
import { i18nContext } from "@/i18n/context";
import ShowDetail from "@/components/show_detail/ShowDetail";
import { useShowDetail } from "@/components/show_detail/use_show_detail";
import CreateDataSuccess from "../create_attestation/CreateDataSuccess";

const EncryptedMemberIdItem: React.FC<EncryptedWalletAddrItemProps> = ({
  memberIdCacheKeys,
  memberIdEnc,
}) => {
  const i18n = React.useContext(i18nContext);
  const { showDetail, setShowDetail } = useShowDetail();

  const elems = React.useMemo(() => {
    if (memberIdCacheKeys) {
      const elems = [];
      for (const key in memberIdCacheKeys) {
        if (memberIdCacheKeys[key]) {
          elems.push(
            <p key={memberIdCacheKeys[key]} className={styles.cacheKey}>
              {abbrev7and5(memberIdCacheKeys[key])},
            </p>,
          );
        } else {
          console.error("Key is not found, dismissing, key: %s", key);
        }
      }
      return elems;
    } else {
      return null;
    }
  }, [memberIdCacheKeys]);

  return (
    <div className={styles.wrapper}>
      <CreateDataSuccess />
      <div className={cn(styles.valueDetail, { [styles.display]: showDetail })}>
        <div>{i18n.save_wallet_address_in_cache_for_future_use} (automatic)</div>
        <div className={styles.content}>
          {elems && (
            <div className={styles.item}>
              <p className={styles.label}>
                We will use the least recently used cache key among these
              </p>
              <div>{elems}</div>
            </div>
          )}
          {memberIdEnc && (
            <div className={styles.item}>
              <p className={styles.label}>{i18n.encrypted_member_id}</p>
              <p>{memberIdEnc}</p>
            </div>
          )}
        </div>
      </div>
      <ShowDetail showDetail={showDetail} setShowDetail={setShowDetail} />
    </div>
  );
};

export default EncryptedMemberIdItem;

export interface EncryptedWalletAddrItemProps {
  memberIdCacheKeys: Record<string, string> | null;
  memberIdEnc: string | null;
}
