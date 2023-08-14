"use client";

import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofTypeDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Dropdown, {
  CreateDropdownListArgs,
  DropdownData,
  DropdownSingleSelectedValue,
} from "@taigalabs/prfs-react-components/src/dropdown/Dropdown";
import DropdownEntry from "@taigalabs/prfs-react-components/src/dropdown/DropdownEntry";
import DropdownList from "@taigalabs/prfs-react-components/src/dropdown/DropdownList";

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
            <div>{i18n.driver_id}:</div>
            <div>{val.driver_id}</div>
          </div>
          <div className={styles.item}>
            <div>{i18n.num_inputs}:</div>
            <div>{Object.keys(val.circuit_inputs).length}</div>
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
    prfsApi
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
          <li className={styles.entryWrapper} key={val.proof_type_id} onClick={handleClickEntry}>
            <ProofTypeEntry val={val} />
          </li>
        );
      }

      return (
        <DropdownList>
          <div className={styles.listContainer}>{entries}</div>
        </DropdownList>
      );
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
