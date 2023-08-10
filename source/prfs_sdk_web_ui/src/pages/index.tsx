import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import "./index.scss";
import Home from "@/pages/home/Home";
import { I18nContext, i18n } from "@/contexts/i18n";
import ProofGen from "./proof_gen/ProofGen";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

function Root() {
  return (
    <I18nContext.Provider value={i18n}>
      <Router>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/proof_gen" component={ProofGen} />
        </Routes>
      </Router>
    </I18nContext.Provider>
  );
}

render(Root, root!);
