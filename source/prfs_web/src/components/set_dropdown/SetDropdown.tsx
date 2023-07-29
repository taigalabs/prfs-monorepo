"use client";

import React from "react";

import styles from "./SetDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";
import Dropdown, { DropdownData, DropdownSelectedValue } from "@/components/dropdown/Dropdown";
import { PrfsSetKeys } from "@/models";
import { RecordOfKeys } from "@/models/types";

const SetDropdown: React.FC<SetDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<DropdownData<PrfsSetKeys>>({
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

  const handleClickEntry = React.useCallback(() => {
    console.log("123");
  }, []);

  const createBase = React.useMemo(() => {
    return <div className={styles.dropdownBase}>{i18n.select_sets}</div>;
  }, [handleSelectVal]);

  const createList = React.useMemo(() => {
    let { values } = data;

    if (values === undefined) {
      return <div>no element</div>;
    }

    let entries = [];
    for (let set of values) {
      entries.push(
        <li className={styles.entryWrapper} key={set.set_id} onClick={handleClickEntry}>
          <div className={styles.titleRow}>
            <div>{set.label}</div>
            <div>{set.set_id}</div>
          </div>
          <div className={styles.body}>
            <div className={styles.item}>
              <p>{i18n.hash_algorithm}:</p>
              <p>{set.hash_algorithm}</p>
            </div>
            <div className={styles.item}>
              <p>{i18n.cardinality}:</p>
              <p>{set.cardinality}</p>
            </div>
            <div className={styles.item}>
              <p>{i18n.element_type}:</p>
              <p>{set.element_type}</p>
            </div>
          </div>
        </li>
      );
    }

    return <ul className={styles.listWrapper}>{entries}</ul>;
  }, [data]);

  return <Dropdown baseElem={createBase} listElem={createList} />;
};

export default SetDropdown;

export interface SetDropdownProps {
  selectedVal: DropdownSelectedValue<PrfsSetKeys>;
  handleSelectVal: (row: RecordOfKeys<PrfsSetKeys>) => void;
}
