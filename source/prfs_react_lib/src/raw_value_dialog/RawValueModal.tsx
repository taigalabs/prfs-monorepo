import React from "react";
import cn from "classnames";

import styles from "./RawValueModal.module.scss";
import Button from "../button/Button";
import Input from "../input/Input";
import { usePrfsReactI18N } from "../i18n/i18nContext";

const RawValueModal: React.FC<CachedItemModalProps> = ({
  handleClickClose,
  handleClickSubmit,
  label,
}) => {
  const i18n = usePrfsReactI18N();
  const [value, setValue] = React.useState("");

  const extendedHandleChangeValue = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget?.value;
      if (value) {
        setValue(value);
      } else {
        setValue("");
      }
    },

    [setValue],
  );

  const extendedHandleClickSubmit = React.useCallback(() => {
    handleClickSubmit(value);
  }, [handleClickSubmit, value]);

  return (
    <div className={styles.wrapper}>
      <Input name={""} label={label} value={value} handleChangeValue={extendedHandleChangeValue} />
      <div className={styles.btnRow}>
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
        <Button variant="blue_3" handleClick={extendedHandleClickSubmit}>
          {i18n.submit}
        </Button>
      </div>
    </div>
  );
};

export default RawValueModal;

export interface CachedItemModalProps {
  handleClickClose: () => void;
  handleClickSubmit: (addr: string) => void;
  label: string;
}
