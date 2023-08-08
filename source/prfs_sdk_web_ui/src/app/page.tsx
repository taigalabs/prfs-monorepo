"use client";

import React from "react";

import styles from "./Home.module.scss";
// import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
// import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
// import Teaser from "@/components/teaser/Teaser";
// import Card from "@/components/card/Card";
// import CardRow from "@/components/card_row/CardRow";
// import CircuitTable from "@/components/circuit_table/CircuitTable";
// import ExploreTechSection from "@/components/explore_tech_section/ExploreTechSection";
// import LatestPrfsUpdateSection from "@/components/latest_prfs_update_section/LatestPrfsUpdateSection";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  // useLocalWallet(dispatch);
  return <div>55</div>;

  // return <ProofGen />;
};

export default Home;
