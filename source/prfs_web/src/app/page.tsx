"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Teaser from "@/components/teaser/Teaser";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitTable from "@/components/circuit_table/CircuitTable";
import ExploreTechSection from "@/components/explore_tech_section/ExploreTechSection";
import LatestPrfsUpdateSection from "@/components/latest_prfs_update_section/LatestPrfsUpdateSection";
import ProjectMeta from "@/components/project_meta/ProjectMeta";
import { paths } from "@/routes/path";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_TEASER !== "yes") {
      router.push(paths.proof__proof_instances);
    }
  }, [router]);

  return process.env.NEXT_PUBLIC_IS_TEASER === "yes" ? <Teaser /> : <div></div>;
};

export default Home;
