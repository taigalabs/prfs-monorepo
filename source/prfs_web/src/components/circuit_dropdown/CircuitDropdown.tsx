"use client";

import React from "react";

import styles from "./CircuitDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";
import Dropdown, { DropdownData, DropdownSelectedValue } from "@/components/dropdown/Dropdown";
import { PrfsCircuitKeys, PrfsSetKeys } from "@/models";
import { RecordOfKeys } from "@/models/types";

const CircuitDropdown: React.FC<CircuitDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<DropdownData<PrfsCircuitKeys>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    prfsBackend
      .getPrfsNativeCircuits({
        page: 0,
      })
      .then(resp => {
        const { page, prfs_circuits } = resp.payload;
        setData({ page, values: prfs_circuits });
      });
  }, [setData]);

  const handleClickEntry = React.useCallback(() => {
    console.log("123");
  }, []);

  const createBase = React.useMemo(() => {
    return <div className={styles.dropdownBase}>{i18n.select_sets}</div>;
  }, [selectedVal]);

  const createList = React.useMemo(() => {
    let { values } = data;

    if (values === undefined) {
      return <div>no element</div>;
    }

    let entries = [];
    for (let val of values) {
      entries.push(
        <li className={styles.entryWrapper} key={val.circuit_id} onClick={handleClickEntry}>
          <div className={styles.titleRow}>
            <p>{val.label}</p>
            <p>{val.circuit_id}</p>
          </div>
          <div className={styles.body}>
            <div className={styles.item}>
              <p>{i18n.proof_algorithm}:</p>
              <p>{val.proof_algorithm}</p>
            </div>
            <div className={styles.item}>
              <div>{i18n.num_public_inputs}:</div>
              <div>{val.public_inputs.length}</div>
            </div>
            <div className={styles.item}>
              <p>{i18n.circuit_dsl}:</p>
              <p>{val.circuit_dsl}</p>
            </div>
            <div className={styles.item}>
              <p>{i18n.elliptic_curve}:</p>
              <p>{val.elliptic_curve}</p>
            </div>
          </div>
        </li>
      );
    }

    return <ul className={styles.listWrapper}>{entries}</ul>;
  }, [data]);

  return <Dropdown baseElem={createBase} listElem={createList} />;
};

export default CircuitDropdown;

export interface CircuitDropdownProps {
  selectedVal: DropdownSelectedValue<PrfsCircuitKeys>;
  handleSelectVal: (val: RecordOfKeys<PrfsCircuitKeys>) => void;
}
