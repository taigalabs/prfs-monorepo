"use client";

import React from "react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";
import { paths } from "@/paths";

const ProofsPage: React.FC = () => {
  redirect(paths.__);
};

export default ProofsPage;
