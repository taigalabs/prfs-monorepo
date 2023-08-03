"use client";

import React from "react";

import styles from "./ProofTypeDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@/components/dropdown/Dropdown";
import DropdownEntry from "../dropdown/DropdownEntry";
import DropdownList from "../dropdown/DropdownList";
import { PrfsCircuit, PrfsProofType } from "@/models";

const ProofTypeEntry: React.FC<CircuitEntryProps> = ({ val }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <DropdownEntry>
      <div className={styles.dropdownEntry}>
        <div className={styles.titleRow}>
          <p>{val.label}</p>
          <p>{val.proof_type_id}</p>
        </div>
        <div className={styles.titleRow}>
          <p>{val.desc}</p>
        </div>
        <div className={styles.body}>
          <div className={styles.item}>
            <p>{i18n.circuit_id}:</p>
            <p>{val.circuit_id}</p>
          </div>
          <div className={styles.item}>
            <div>{i18n.program_id}:</div>
            <div>{val.program_id}</div>
          </div>
          <div className={styles.item}>
            <div>{i18n.num_inputs}:</div>
            <div>{Object.keys(val.public_input_instance).length}</div>
          </div>
        </div>
      </div>
    </DropdownEntry>
  );
};

const ProofTypeDropdown: React.FC<ProofTypeDropdownProps> = ({ selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<DropdownData<PrfsProofType>>({
    page: 0,
    values: [],
  });

  React.useEffect(() => {
    prfsBackend
      .getPrfsProofTypes({
        page: 0,
      })
      .then(resp => {
        const { page, prfs_proof_types } = resp.payload;
        setData({ page, values: prfs_proof_types });
      });
  }, [setData]);

  const createBase = React.useCallback(() => {
    return (
      <div className={styles.dropdownBase}>
        {selectedVal ? (
          <ProofTypeEntry val={selectedVal} />
        ) : (
          <div className={styles.guide}>{i18n.select_proof_type}</div>
        )}
      </div>
    );
  }, [selectedVal]);

  const createList = React.useCallback(
    ({ upgradedHandleSelectVal }: CreateDropdownListArgs<PrfsProofType>) => {
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
            <ProofTypeEntry val={val} />
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

export default ProofTypeDropdown;

export interface ProofTypeDropdownProps {
  selectedVal: DropdownSingleSelectedValue<PrfsProofType> | undefined;
  handleSelectVal: (val: PrfsProofType) => void;
}

export interface CircuitEntryProps {
  val: PrfsProofType;
}
