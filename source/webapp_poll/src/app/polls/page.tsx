"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./PollPage.module.scss";
import { paths } from "@/paths";

const PollsPage: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {}, [router]);

  return <div>Redirecting...</div>;
};

export default PollsPage;
