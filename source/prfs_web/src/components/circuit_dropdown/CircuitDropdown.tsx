"use client";

import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import * as prfsApi from "@taigalabs/prfs-api-js";

import styles from "./CircuitDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@/components/dropdown/Dropdown";
import DropdownEntry from "../dropdown/DropdownEntry";
import DropdownList from "../dropdown/DropdownList";

const CircuitEntry: React.FC<CircuitEntryProps> = ({ val }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <DropdownEntry>
      <div className={styles.dropdownEntry}>
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
            <div>{val.circuit_inputs_meta.length}</div>
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
      </div>
    </DropdownEntry>
  );
};

const CircuitDropdown: React.FC<CircuitDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<DropdownData<PrfsCircuit>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    prfsApi
      .getPrfsNativeCircuits({
        page: 0,
      })
      .then(resp => {
        const { page, prfs_circuits } = resp.payload;
        setData({ page, values: prfs_circuits });
      });
  }, [setData]);

  const createBase = React.useCallback(() => {
    return (
      <div className={styles.dropdownBase}>
        {selectedVal ? (
          <CircuitEntry val={selectedVal} />
        ) : (
          <div className={styles.guide}>{i18n.select_circuit}</div>
        )}
      </div>
    );
  }, [selectedVal]);

  const createList = React.useCallback(
    ({ upgradedHandleSelectVal }: CreateDropdownListArgs<PrfsCircuit>) => {
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
          <li className={styles.entryWrapper} key={val.circuit_id} onClick={handleClickEntry}>
            <CircuitEntry val={val} />
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

export default CircuitDropdown;

export interface CircuitDropdownProps {
  selectedVal: DropdownSingleSelectedValue<PrfsCircuit> | undefined;
  handleSelectVal: (val: PrfsCircuit) => void;
}

export interface CircuitEntryProps {
  val: PrfsCircuit;
}
