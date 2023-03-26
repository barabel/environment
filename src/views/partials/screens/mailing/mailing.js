import React from "react";
import { createRoot } from "react-dom/client";
import Form from "../../molecules/form/form";

export default class Mailing {
  constructor(parent) {
    this.parent = parent;
    this.props = window.mailingForm?.form;

    const root = this.parent.querySelector('.mailing__form');
    if (root) {
      this.initForm(root);
    }
  }

  initForm(root) {
    const renderRoot = createRoot(root);
    renderRoot.render(<Form type="mailing" {...this.props} />);
  }
}
