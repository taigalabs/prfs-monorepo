import React from "react";

import styles from "./WalletDropdown.module.scss";
import i18n from "@/i18n/en";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@taigalabs/prfs-react-components/src/dropdown/Dropdown";
import DropdownEntry from "@taigalabs/prfs-react-components/src/dropdown/DropdownEntry";
import DropdownList from "@taigalabs/prfs-react-components/src/dropdown/DropdownList";

const WalletEntry: React.FC<WalletEntryProps> = ({ val }) => {
  return (
    <DropdownEntry>
      <div className={styles.dropdownEntry}>{val.label}</div>
    </DropdownEntry>
  );
};

const WalletDropdown: React.FC<WalletDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const [data, setData] = React.useState<DropdownData<WalletData>>({
    page: 0,
    values: [],
  });

  const createBase = React.useCallback(() => {
    return (
      <div className={styles.dropdownBase}>
        {selectedVal ? (
          <WalletEntry val={selectedVal} />
        ) : (
          <div className={styles.guide}>{i18n.select_circuit}</div>
        )}
      </div>
    );
  }, [selectedVal]);

  const createList = React.useCallback(
    ({ upgradedHandleSelectVal }: CreateDropdownListArgs<WalletData>) => {
      // console.log(11, data);
      let { values } = data;

      if (values === undefined) {
        return <div>no element</div>;
      }

      let entries = [];
      for (let val of values) {
        const handleClickEntry = () => {
          upgradedHandleSelectVal(val);
        };

        entries.push(
          <li className={styles.entryWrapper} key={val.label} onClick={handleClickEntry}>
            <WalletEntry val={val} />
          </li>
        );
      }

      return <DropdownList>{entries}</DropdownList>;
    },
    [data, handleSelectVal]
  );

  return (
    <Dropdown createBase={createBase} createList={createList} handleSelectVal={handleSelectVal} />
  );
};

export interface WalletDropdownProps {
  selectedVal: DropdownSingleSelectedValue<WalletData> | undefined;
  handleSelectVal: (val: WalletData) => void;
}

export interface WalletData {
  label: string;
}

export interface WalletEntryProps {
  val: WalletData;
}

export default WalletDropdown;
