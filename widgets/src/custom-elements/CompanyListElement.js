import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import CompanyList from 'components/CompanyList/CompanyListContainer';

class CompanyListElement extends HTMLElement {
  constructor(props) {
    super(props);
  }

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute('page-code');
    const frameId = this.getAttribute('frame-id');
    const serviceUrl = this.getAttribute('service-url');

    const reactRoot = React.createElement(
      CompanyList,
      { onError: this.onError, pageCode, frameId, serviceUrl },
      null
    );
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('company-list', CompanyListElement);

export default CompanyListElement;
