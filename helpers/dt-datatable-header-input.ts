import {
  LitElement, css, customElement, html, property,
} from 'lit-element';

import '@material/mwc-textfield';

@customElement('dt-datatable-header-input')
export default class DtDatatableHeaderInput extends LitElement {
  @property({ type: String }) header = '';

  @property({ type: String }) direction: '' | 'asc' | 'desc' = '';

  @property({ type: Boolean }) active = false;

  @property({ type: String }) filterValue: string | null = null;

  @property({ type: String }) property = '';

  static get styles() {
    const mainStyle = css`
      :host {
        display: block;
      }`;
    return [mainStyle];
  }

  render() {
    let content = html`
      <div class="layout horizontal center">
        <div class="header" @tap="${this.toggleActive.bind(this)}">
          ${this.header}
        </div>
      </div>
    `;
    if (this.active) {
      content = html`
        <mwc-textfield label="">
        </mwc-text-field>`;
    }
    return content;
  }

  async toggleActive() {
    this.active = !this.active;
    this.dispatchEvent(new CustomEvent('active-changed', { detail: { value: this.active } }));
    if (!this.active && this.filterValue) {
      this.filterValue = null;
      this.dispatchFilterEvent();
    } else {
      // await this.updateComplete;
      // if (this.shadowRoot) {
      //   const paperInput = this.shadowRoot.querySelector('paper-input');
      //   if (paperInput) {
      //     paperInput.setAttribute('tabindex', '1');
      //     paperInput.focus();
      //   }
      // }
    }
  }

  directionChanged({ detail }: CustomEvent<{ value: 'asc' | 'desc' | '' }>) {
    if (this.direction !== detail.value) {
      this.direction = detail.value;
      this.dispatchEvent(new CustomEvent('direction-changed', { detail: { value: this.direction } }));
    }
  }

  valueChanged({ detail }: CustomEvent<{ value: string }>) {
    if (this.filterValue !== detail.value) {
      this.filterValue = detail.value;
      this.dispatchFilterEvent();
    }
  }

  dispatchFilterEvent() {
    this.dispatchEvent(new CustomEvent('filter-value-changed', { detail: { value: this.filterValue, property: this.property } }));
  }
}
