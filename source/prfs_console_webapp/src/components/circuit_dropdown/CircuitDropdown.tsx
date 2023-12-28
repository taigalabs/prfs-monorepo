"use client";

import React from "react";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@taigalabs/prfs-react-components/src/dropdown/Dropdown";
import DropdownEntry from "@taigalabs/prfs-react-components/src/dropdown/DropdownEntry";
import DropdownList from "@taigalabs/prfs-react-components/src/dropdown/DropdownList";
import { PrfsCircuitSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsCircuitSyn1";

import styles from "./CircuitDropdown.module.scss";
import { i18nContext } from "@/i18n/context";

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
            <div>{val.raw_circuit_inputs_meta.length}</div>
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

  const [data, setData] = React.useState<DropdownData<PrfsCircuitSyn1>>({
    page_idx: 0,
    values: [],
  });

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_circuits", {
        page_idx: 0,
        page_size: 0,
      });

      if (payload) {
        setData({ page_idx: payload.page_idx, values: payload.prfs_circuits_syn1 });
      }
    }

    fn().then();
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
    ({ upgradedHandleSelectVal }: CreateDropdownListArgs<PrfsCircuitSyn1>) => {
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
          </li>,
        );
      }

      return <DropdownList>{entries}</DropdownList>;
    },
    [data, handleSelectVal],
  );

  return (
    <Dropdown createBase={createBase} createList={createList} handleSelectVal={handleSelectVal} />
  );
};

export default CircuitDropdown;

export interface CircuitDropdownProps {
  selectedVal: DropdownSingleSelectedValue<PrfsCircuitSyn1> | undefined;
  handleSelectVal: (val: PrfsCircuitSyn1) => void;
}

export interface CircuitEntryProps {
  val: PrfsCircuitSyn1;
}
