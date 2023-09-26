import React from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import cn from "classnames";

import styles from "./WalletModal.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";

const ConnectedInfo: React.FC<ConnectedInfoProps> = ({
  ensName,
  address,
  connector,
  handleClickDisconnect,
  handleClickClose,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.connectInfo}>
      <div className={styles.connector}>
        Connected to <b>{connector.name}</b>
      </div>
      <div className={styles.address}>{ensName ? `${ensName} (${address})` : address}</div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" handleClick={handleClickDisconnect}>
          {i18n.disconnect}
        </Button>
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
      </div>
    </div>
  );
};

const WalletModal: React.FC<WalletModalProps> = ({ handleClickClose }) => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClickDisconnect = React.useCallback(() => {
    disconnect();
  }, [disconnect]);

  const connectorsElem = React.useMemo(() => {
    return (
      <ul className={styles.connectList}>
        {connectors.map(connector => (
          <li key={connector.id}>
            <button disabled={!connector.ready} onClick={() => connect({ connector })}>
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
            </button>
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
          handleClickDisconnect={handleClickDisconnect}
          handleClickClose={handleClickClose}
        />
      ) : (
        connectorsElem
      )}
      <div></div>
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default WalletModal;

export interface WalletModalProps {
  handleClickClose: () => void;
}

interface ConnectedInfoProps {
  ensName: string | null | undefined;
  address: `0x${string}` | undefined;
  connector: Connector<any, any>;
  handleClickDisconnect: () => void;
  handleClickClose: () => void;
}
