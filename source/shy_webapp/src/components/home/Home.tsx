"use client";

import React from "react";

import styles from "./Home.module.scss";
import Channels from "@/components/channels/Channels";
import { useShyCache } from "@/hooks/user";
import Loading from "../loading/Loading";

const Home: React.FC<HomeProps> = () => {
  const { shyCache, isCacheInitialized } = useShyCache();

  return isCacheInitialized ? <Channels /> : <Loading />;
};

export default Home;

export interface HomeProps {}
