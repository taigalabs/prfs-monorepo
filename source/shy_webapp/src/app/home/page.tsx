import React from "react";

import { paths } from "@/paths";
import Home from "@/components/home/Home";
import Teaser from "@/components/teaser/Teaser";

const IS_TEASER = false;

const HomePage: React.FC = () => {
  return IS_TEASER ? <Teaser /> : <Home />;
};

export default HomePage;
