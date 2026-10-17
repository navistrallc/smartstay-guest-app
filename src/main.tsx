import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ToastProvider } from "./components/Toast";
import { loadStay } from "./lib/stay";
import { TABS } from "./components/TabBar";
import "./styles.css";

/* The guest's link ends in #<stay token>. Tab names (#explore etc.) are not tokens. */
const hash = location.hash.slice(1);
const token = TABS.some(t => t[0] === hash) ? "" : hash;

loadStay(token).then(stay => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ToastProvider>
        <App stay={stay} />
      </ToastProvider>
    </StrictMode>,
  );
});
