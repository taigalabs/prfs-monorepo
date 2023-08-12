import React from "react";
import Image from "next/image";
import cn from "classnames";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@taigalabs/prfs-react-components/src/dropdown/Dropdown";
import DropdownEntry from "@taigalabs/prfs-react-components/src/dropdown/DropdownEntry";
import DropdownList from "@taigalabs/prfs-react-components/src/dropdown/DropdownList";

import styles from "./WalletSelect.module.scss";
import MetamaskSvg from "@/assets/svg/MetaMask_Fox.svg";
import { i18nContext } from "@/contexts/i18n";

const walletData = [
  {
    id: "metamask",
    label: "Metamask",
  },
];

const WalletSelect: React.FC<WalletSelectProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const itemsElem = React.useMemo(() => {
    const elems = [];

    for (const wallet of walletData) {
      let icon;
      switch (wallet.id) {
        case "metamask":
          icon = <Image src={MetamaskSvg} width={24} height={24} alt={wallet.label} />;
          break;
        default:
          continue;
      }

      const elem = (
        <li
          key={wallet.id}
          className={cn({
            [styles.item]: true,
            [styles.selected]: selectedVal && selectedVal.label === "power",
          })}
        >
          <div>{icon}</div>
          <div>{wallet.label}</div>
        </li>
      );

      elems.push(elem);
    }

    return elems;
  }, [selectedVal, handleSelectVal]);

  return (
    <div>
      <ul className={styles.walletList}>{itemsElem}</ul>
    </div>
  );
};

export default WalletSelect;

export interface WalletSelectProps {
  selectedVal: WalletData | undefined;
  handleSelectVal: (val: WalletData) => void;
}

export interface WalletData {
  label: string;
}

export interface WalletEntryProps {
  val: WalletData;
}
