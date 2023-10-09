"use client";

import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const PPage: React.FC = () => {
  redirect(paths.__);
};

export default PPage;
