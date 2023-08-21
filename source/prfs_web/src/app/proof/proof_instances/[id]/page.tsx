"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiFillTwitterSquare } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import ProofInstanceDetailTable from "@/components/proof_instance_detail_table/ProofInstanceDetailTable";
import ProofInstanceQRCode from "@/components/proof_instance_qrcode/ProofInstanceQRCode";
import { paths } from "@/routes/path";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.proof_instance} ${params.id}`;

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  React.useEffect(() => {
    const id = +decodeURIComponent(params.id);

    prfsApi
      .getPrfsProofInstances({
        page: 0,
        id,
      })
      .then(resp => {
        const { prfs_proof_instances_syn1 } = resp.payload;

        if (prfs_proof_instances_syn1.length > 0) {
          setProofInstance(prfs_proof_instances_syn1[0]);
        } else {
          console.error("Proof instance is not found, invalid access");

          // router.push(paths.proof__proof_instances);
        }
      });
  }, [setProofInstance]);

  return (
    proofInstance && (
      <DefaultLayout>
        <CardRow>
          <Card>
            <Widget>
              <TopWidgetTitle>
                <div className={styles.header}>
                  <div className={styles.navigation}>
                    <Link href={paths.proof__proof_instances}>
                      <ArrowButton variant="left" />
                    </Link>
                  </div>
                  <WidgetLabel>{topWidgetLabel}</WidgetLabel>
                </div>
              </TopWidgetTitle>
              <div className={styles.infoRow}>
                <div className={styles.proofInstanceDetailTableContainer}>
                  <ProofInstanceDetailTable proofInstance={proofInstance} />
                </div>
                <div className={styles.right}>
                  <ProofInstanceQRCode proofInstance={proofInstance} />
                  <ul className={styles.social}>
                    <li>
                      <AiFillTwitterSquare />
                      <span>{i18n.twitter}</span>
                    </li>
                    <li>
                      <BsTelegram />
                      <span>{i18n.telegram}</span>
                    </li>
                    <li>
                      <BiLogoDiscord />
                      <span>{i18n.discord}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <div className={styles.row}>
                <div>power</div>
              </div>
            </Widget>
          </Card>
        </CardRow>
      </DefaultLayout>
    )
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    id: string;
  };
}
