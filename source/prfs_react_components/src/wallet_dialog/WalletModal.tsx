import React from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import cn from "classnames";

import styles from "./WalletModal.module.scss";

const ConnectedInfo: React.FC<ConnectedInfoProps> = ({
  ensName,
  address,
  connector,
  disconnect,
}) => {
  return (
    <div>
      <div>{ensName ? `${ensName} (${address})` : address}</div>
      <div>Connected to {connector.name}</div>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
};

const WalletModal = () => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

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

  if (isConnected && connector) {
    return (
      <div>
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector.name}</div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {isConnected && connector ? (
        <ConnectedInfo
          ensName={ensName}
          address={address}
          connector={connector}
          disconnect={disconnect}
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

export interface WalletModalProps {}

interface ConnectedInfoProps {
  ensName: string | null | undefined;
  address: `0x${string}` | undefined;
  connector: Connector<any, any>;
  disconnect: () => void;
}
