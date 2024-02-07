import React from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from "@taigalabs/prfs-crypto-deps-js/wagmi";
import cn from "classnames";
import { abbrevAddr } from "@taigalabs/prfs-crypto-js";

import styles from "./WalletModal.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

const ConnectedInfo: React.FC<ConnectedInfoProps> = ({
  ensName,
  address,
  connector,
  handleChangeAddress,
}) => {
  const i18n = React.useContext(i18nContext);
  const addr = React.useMemo(() => {
    if (address) {
      return abbrevAddr(address);
    } else {
      return "";
    }
  }, [address]);

  const extendedHandleChangeAddress = React.useCallback(() => {
    handleChangeAddress(address as string);
  }, [handleChangeAddress, address]);

  return (
    <div className={styles.connectInfo}>
      <div className={styles.connector}>
        <p>
          Connected to <b>{connector.name}</b>
        </p>
        <p>Other options will be available later</p>
      </div>
      <div className={styles.address}>
        <Button
          variant="white_black_2"
          className={styles.itemBtn}
          handleClick={extendedHandleChangeAddress}
        >
          {ensName ? `${ensName} (${address})` : addr}
        </Button>
      </div>
    </div>
  );
};

const WalletModal: React.FC<WalletModalProps> = ({ handleClickClose, handleChangeAddress }) => {
  const i18n = React.useContext(i18nContext);
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const handleClickDisconnect = React.useCallback(() => {
    disconnect();
  }, [disconnect]);

  const connectorsElem = React.useMemo(() => {
    return (
      <ul className={styles.itemList}>
        {connectors.map((connector: Connector) => (
          <li key={connector.id}>
            <Button
              variant="white_black_2"
              handleClick={() => connect({ connector })}
              className={styles.itemBtn}
            >
              {connector.name}
            </Button>
          </li>
        ))}
      </ul>
    );
  }, [connectors]);

  return (
    <div className={styles.wrapper}>
      {isConnected && connector ? (
        <ConnectedInfo
          ensName={ensName}
          address={address}
          connector={connector}
          handleChangeAddress={handleChangeAddress}
          // handleClickDisconnect={handleClickDisconnect}
          // handleClickClose={handleClickClose}
        />
      ) : (
        connectorsElem
      )}
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" handleClick={handleClickDisconnect}>
          {i18n.disconnect}
        </Button>
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
      </div>
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default WalletModal;

export interface WalletModalProps {
  handleClickClose: () => void;
  handleChangeAddress: (addr: any) => void;
}

interface ConnectedInfoProps {
  ensName: string | null | undefined;
  address: `0x${string}` | undefined;
  connector: Connector;
  handleChangeAddress: (addr: string) => void;
  // handleClickDisconnect: () => void;
  // handleClickClose: () => void;
}
