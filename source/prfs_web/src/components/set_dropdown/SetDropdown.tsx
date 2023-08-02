"use client";

import React from "react";

import styles from "./SetDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@/components/dropdown/Dropdown";
import { PrfsSet } from "@/models";
import DropdownEntry from "@/components/dropdown/DropdownEntry";
import DropdownList from "@/components/dropdown/DropdownList";

const SetEntry: React.FC<SetEntryProps> = ({ val }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <DropdownEntry>
      <div className={styles.dropdownEntry}>
        <div className={styles.titleRow}>
          <div>{val.label}</div>
          <div>{val.set_id}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.item}>
            <p>{i18n.hash_algorithm}:</p>
            <p>{val.hash_algorithm}</p>
          </div>
          <div className={styles.item}>
            <p>{i18n.cardinality}:</p>
            <p>{val.cardinality}</p>
          </div>
          <div className={styles.item}>
            <p>{i18n.element_type}:</p>
            <p>{val.element_type}</p>
          </div>
        </div>
      </div>
    </DropdownEntry>
  );
};

const SetDropdown: React.FC<SetDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<DropdownData<PrfsSet>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    prfsBackend
      .getSets({
        page: 0,
      })
      .then(resp => {
        const { page, prfs_sets } = resp.payload;
        setData({ page, values: prfs_sets });
      });
  }, [setData]);

  const createBase = React.useCallback(() => {
    return (
      <div className={styles.dropdownBase}>
        {selectedVal ? (
          <SetEntry val={selectedVal} />
        ) : (
          <DropdownEntry>
            <div className={styles.guide}>{i18n.select_circuit}</div>
          </DropdownEntry>
        )}
      </div>
    );
  }, [selectedVal]);

  const createList = React.useCallback(
    ({ upgradedHandleSelectVal }: CreateDropdownListArgs<PrfsSet>) => {
      let { values } = data;

      if (values === undefined) {
        return <div>no element</div>;
      }

      let entries = [];
      for (let val of values) {
        const handleClickEntry = () => {
          // console.log(11, val);
          upgradedHandleSelectVal(val);
        };

        entries.push(
          <li className={styles.entryInList} key={val.set_id} onClick={handleClickEntry}>
            <SetEntry val={val} />
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

export default SetDropdown;

export interface SetDropdownProps {
  selectedVal: DropdownSingleSelectedValue<PrfsSet>;
  handleSelectVal: (row: PrfsSet) => void;
}

export interface SetEntryProps {
  val: PrfsSet;
}
