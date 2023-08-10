import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import "./index.css";
import Home from "@/pages/home/Home";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
      </Routes>
    </Router>
  );
}

render(Root, root!);
