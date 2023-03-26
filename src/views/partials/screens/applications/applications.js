import React from "react";
import { createRoot } from "react-dom/client";
import Form from "../../molecules/form/form";

export default class Applications {
  constructor(parent) {
    this.parent = parent;
    this.props = window.applicationsForm?.form;

    const root = this.parent.querySelector('.applications__form');
    if (root) {
      this.initForm(root);
    }
  }

  initForm(root) {
    const renderRoot = createRoot(root);
    renderRoot.render(<Form type="applications" {...this.props} />);
  }
}
