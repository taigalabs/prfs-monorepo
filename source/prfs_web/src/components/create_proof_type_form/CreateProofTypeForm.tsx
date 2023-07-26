import React from "react";
import Link from "next/link";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proof_types">{i18n.proof_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <div>title</div>
      <CardRow>
        <Card>
          <Widget label={i18n.name}>dir</Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget label={i18n.choose_circuit}>aa</Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget label={i18n.choose_set}>aa</Widget>
        </Card>
      </CardRow>
      <div>button row</div>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}
