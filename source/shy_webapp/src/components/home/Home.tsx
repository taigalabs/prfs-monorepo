"use client";

import React from "react";

import styles from "./Home.module.scss";
import Channels from "@/components/channels/Channels";

const Home: React.FC<HomeProps> = () => {
  return <Channels />;
};

export default Home;

export interface HomeProps {}
