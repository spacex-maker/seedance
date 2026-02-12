import React from "react";
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from "./App";
import Modal from "react-modal";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

Modal.setAppElement("#root");

const container = document.getElementById('root');
// 预渲染（react-snap）后根节点已有内容，用 hydrate 接上；否则正常 render
if (container?.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  const root = createRoot(container);
  root.render(<App />);
}
