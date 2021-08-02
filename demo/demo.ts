/* eslint no-unused-vars: off, no-undef: off */

import {
  LitElement, html, css, property,
} from 'lit-element';

import type { HeaderParams, Params } from '../dt-datatable';
import '../dt-datatable';
import '../helpers/dt-datatable-header-input';

interface Data {
  fruit: string;
  color: string;
  weight: {
    unit: string;
    value: number;
  }
}

class DtDatatableDemo extends LitElement {
  @property({ type: String }) color = 'red';

  static get styles() {
    const mainStyle = css`
      :host {
        display: block;
      }
    `;
    return [mainStyle];
  }

  firstUpdated() {
    setTimeout(() => {
      this.color = 'blue';
    }, 2000);
  }

  render() {
    const data = [
      { fruit: 'apple', color: 'green', weight: { unit: 'gr', value: '100' } },
      { fruit: 'banana', color: 'yellow', weight: { unit: 'gr', value: '140' } },
    ];
    const conf = [
      {
        property: 'fruit',
        header: 'Fruit',
        hidden: false,
        renderHeader: (params: HeaderParams) => html`<div style="color: ${this.color};">${params.header}</div>`,
      },
      {
        property: 'color',
        header: 'Color',
        hidden: false,
        renderHeader: (params: HeaderParams) => html`
          <dt-datatable-header-input active header="${params.header}"></dt-datatable-header-input>
        `,
      },
      {
        property: 'weight.value',
        header: 'Weight',
        hidden: false,
        render: (params: Params<Data>) => html`<div>${params.value} ${params.item.weight.unit}</div>`,
      },
    ];

    return html`<dt-datatable .data="${data}" .conf="${conf}"></dt-datatable>`;
  }
}

window.customElements.define('dt-datatable-demo', DtDatatableDemo);
