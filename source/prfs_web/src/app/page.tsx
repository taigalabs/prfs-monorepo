"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { proveMembership } from '@/prfs';

export default function Home() {
  React.useEffect(() => {
    console.log("Home()");
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    proveMembership().then(() => { });
  }, []);

  return (
    <div>
      <button onClick={proverAddressMembership}>Prove Address Membership</button>
    </div>
  );
}
