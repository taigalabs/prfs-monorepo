"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import styles from "./HomePage.module.scss";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import Icon from "./prfs_logo2.svg";

const ImageLogo: React.FC = () => {
  return <Icon />;
};

export default ImageLogo;
