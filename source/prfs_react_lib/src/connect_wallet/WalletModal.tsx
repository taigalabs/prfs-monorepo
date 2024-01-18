import React from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import cn from "classnames";

import styles from "./WalletModal.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

const ConnectedInfo: React.FC<ConnectedInfoProps> = ({
  ensName,
  address,
  connector,
  handleClickDisconnect,
  handleClickClose,
  handleChangeAddress,
}) => {
  const i18n = React.useContext(i18nContext);

  const addr = React.useMemo(() => {
    if (address) {
      return address.substring(0, 5) + "..." + address.substring(address.length - 3);
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
        Connected to <b>{connector.name}</b>
      </div>
      <div className={styles.address}>
        <button onClick={extendedHandleChangeAddress}>{addr}</button>
      </div>
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

const WalletModal: React.FC<WalletModalProps> = ({ handleClickClose, handleChangeAddress }) => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClickDisconnect = React.useCallback(() => {
    disconnect();
  }, [disconnect]);

  const connectorsElem = React.useMemo(() => {
    return (
      <ul className={styles.connectList}>
        {connectors.map(connector => (
          <li key={connector.id}>
            <button onClick={() => connect({ connector })}>
              {connector.name}
              {/* {!connector.ready && " (unsupported)"} */}
              {/* {isLoading && connector.id === pendingConnector?.id && " (connecting)"} */}
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
          handleChangeAddress={handleChangeAddress}
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
  handleChangeAddress: (addr: any) => void;
}

interface ConnectedInfoProps {
  ensName: string | null | undefined;
  address: `0x${string}` | undefined;
  connector: Connector;
  handleChangeAddress: (addr: string) => void;
  handleClickDisconnect: () => void;
  handleClickClose: () => void;
}
