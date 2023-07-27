import React from "react";
import Link from "next/link";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";

const FormSection: React.FC<SectionProps> = ({ children }) => {
  return <div className={styles.formSectionWrapper}>{children}</div>;
};

const FormTextInput: React.FC<FormTextInputProps> = ({ label }) => {
  return (
    <div className={styles.formTextInputWrapper}>
      <div>{label}</div>
      <div>
        <input type="text" />
      </div>
    </div>
  );
};

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proof_types">{i18n.proof_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.titleRow}>
        <div className={styles.title}>{i18n.create_proof_type}</div>
        <div className={styles.subtitle}>{i18n.create_proof_type_subtitle}</div>
      </div>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.name_and_description}</WidgetLabel>
            </WidgetHeader>
            <FormSection>
              <FormTextInput label={i18n.name} />
            </FormSection>
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_circuit}</WidgetLabel>
            </WidgetHeader>
            pp
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_set}</WidgetLabel>
            </WidgetHeader>
            aa
          </Widget>
        </Card>
      </CardRow>
      <div>button row</div>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}

interface SectionProps {
  children: React.ReactNode;
}

interface FormTextInputProps {
  label: string;
}
