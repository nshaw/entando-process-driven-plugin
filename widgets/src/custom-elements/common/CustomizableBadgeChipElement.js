import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import { subscribeToWidgetEvents } from 'custom-elements/customEventsUtils';
import BadgeChip from 'components/common/BadgeChip';

const PDA_CONFIG_PREFIX = 'pda.config';
const PDA_CONFIG_ON_UPDATE = `${PDA_CONFIG_PREFIX}.onUpdate`;

const BADGE_CHIP_INPUT_EVENTS = [PDA_CONFIG_ON_UPDATE];

const ATTRIBUTES = {
  locale: 'locale',
  styles: 'badge-styles',
  label: 'badge-label',
  value: 'badge-value',
  color: 'badge-color',
  bgColor: 'badge-bg-color',
};

/**
 * This Badge Chip element can be used to provide application wide styles via localStorage as
 * well as provide update event in case styles are fetched, otherwise use BadgeChip component
 */
class CustomizableBadgeChipElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.mountPoint = null;
    this.reactRootRef = React.createRef();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!Object.values(ATTRIBUTES).includes(name)) {
      throw new Error(`Untracked changed attribute: ${name}`);
    }
    if (this.mountPoint && newValue !== oldValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);

    this.unsubscribeFromWidgetEvents = subscribeToWidgetEvents(BADGE_CHIP_INPUT_EVENTS, event => {
      const storageStyles = localStorage.getItem('badgeStyles') || '{}';

      if (event.type === PDA_CONFIG_ON_UPDATE) {
        this.setAttribute(ATTRIBUTES.styles, storageStyles);
      }
    });

    this.render();
  }

  render() {
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'en';
    i18next.changeLanguage(locale);

    const label = this.getAttribute(ATTRIBUTES.label);
    const value = this.getAttribute(ATTRIBUTES.value);
    const color = this.getAttribute(ATTRIBUTES.color);
    const bgColor = this.getAttribute(ATTRIBUTES.bgColor);
    const styles = this.getAttribute(ATTRIBUTES.styles) || localStorage.getItem('badgeStyles');

    ReactDOM.render(
      React.createElement(
        BadgeChip,
        { ref: this.reactRootRef, label, value, color, bgColor, styles },
        null
      ),
      this.mountPoint
    );
  }
}

customElements.define('custom-badge-chip', CustomizableBadgeChipElement);

export default CustomizableBadgeChipElement;
