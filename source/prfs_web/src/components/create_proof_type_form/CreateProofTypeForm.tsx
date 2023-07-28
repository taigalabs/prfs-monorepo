import React from "react";
import Link from "next/link";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import {
  FormSection,
  FormTextInput,
  FormTitleRow,
  FormTitle,
  FormSubtitle,
} from "@/components/form/Form";
import CircuitTable, { CircuitTableKeys } from "../circuit_table/CircuitTable";
import SetTable, { SetTableKeys } from "../set_table/SetTable";
import Button from "@/components/button/Button";
import { TableRowValue, TableSelectedValue } from "../table/Table";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);

  const [selectedCircuit, setSelectedCircuit] = React.useState<
    TableSelectedValue<CircuitTableKeys>
  >({});
  const handleSelectCircuit = React.useCallback(
    (val: TableRowValue<CircuitTableKeys>) => {
      console.log(11, val);

      setSelectedCircuit(oldVal => {
        if (oldVal[val.circuit_id]) {
          const newVal = { ...oldVal };
          delete newVal[val.circuit_id];
          return newVal;
        } else {
          return {
            ...oldVal,
            [val.circuit_id]: val,
          };
        }
      });
    },
    [setSelectedCircuit]
  );

  const [selectedSet, setSelectedSet] = React.useState<TableSelectedValue<SetTableKeys>>({});

  return (
    <div className={styles.wrapper}>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proof_types">{i18n.proof_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <FormTitleRow>
        <FormTitle>{i18n.create_proof_type}</FormTitle>
        <FormSubtitle>{i18n.create_proof_type_subtitle}</FormSubtitle>
      </FormTitleRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.name_and_description}</WidgetLabel>
            </WidgetHeader>
            <WidgetPaddedBody>
              <div className={styles.proofName}>
                <FormTextInput label={i18n.name} />
              </div>
            </WidgetPaddedBody>
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_circuit}</WidgetLabel>
            </WidgetHeader>
            <CircuitTable
              selectType="radio"
              selectedVal={selectedCircuit}
              setSelectedVal={setSelectedCircuit}
              handleSelectVal={handleSelectCircuit}
            />
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_set}</WidgetLabel>
            </WidgetHeader>
            <WidgetPaddedBody>power</WidgetPaddedBody>
            <SetTable
              selectType="checkbox"
              selectedVal={selectedSet}
              setSelectedVal={setSelectedSet}
            />
          </Widget>
        </Card>
      </CardRow>
      <div>
        <Button variant="b">{i18n.create_proof_type}</Button>
      </div>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}
