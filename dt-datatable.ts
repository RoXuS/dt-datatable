import { deepEqual } from 'fast-equals';
import {
  LitElement,
  customElement,
  html,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';
import { render } from 'lit-html';

import dtDatatableStyle from './dt-datatable-style';

export interface Params<T = any> {
  value: string;
  item: T;
}

export interface HeaderParams {
  header: string;
  property: string;
}

export interface Conf {
  header: string;
  property: string;
  hidden?: boolean;
  render?: (params: Params) => TemplateResult;
  renderHeader?: (params: HeaderParams) => TemplateResult;
  columnStyle?:string;
}

interface TableElement {
  element: HTMLTableRowElement;
  columns: Array<HTMLTableCellElement>;
}

@customElement('dt-datatable')
export class DtDatatable extends LitElement {
  @property({ type: Array }) data: Array<unknown> = [];

  @property({ type: Array }) conf: Array<Conf> = [];

  @property({ type: Number }) lastConfSize = 0;

  @property({ type: Number }) lastDataSize = 0;

  @property({ type: Array }) headers: Array<HTMLTableHeaderCellElement> = [];

  @property({ type: Boolean }) stickyHeader = false;

  @property({ type: Array }) table: Array<TableElement> = [];

  static get styles() {
    return dtDatatableStyle;
  }

  updated(
    properties: PropertyValues<{
      data: Array<unknown>;
      conf: Array<Conf>;
      sort: string;
    }>,
  ) {
    if (
      (properties.has('data')
        && !deepEqual(properties.get('data'), this.data))
      || (properties.has('conf') && !deepEqual(properties.get('conf'), this.conf))
    ) {
      this.generateData();
    }
    if (properties.has('conf')) {
      const confs = [...this.conf].filter((c) => !c.hidden);
      this.updateHeaders(confs);
    }
    if (properties.has('sort')) {
      // this.updateSortHeaders();
    }
  }

  setLoading(loading: boolean) {
    this.dispatchEvent(new CustomEvent('loading', { detail: { value: loading } }));
  }

  async generateData() {
    this.setLoading(true);
    await this.updateComplete;
    const confs = [...this.conf].filter((c) => !c.hidden);
    this.updateBody(confs);
    if (this.data !== undefined) {
      this.lastDataSize = this.data.length;
      this.lastConfSize = confs.length;
    }
    this.setLoading(false);
  }

  updateHeaders(confs: Array<Conf>) {
    if (this.shadowRoot) {
      let tr = this.shadowRoot.querySelector<HTMLTableRowElement>('table thead tr');
      if (!tr) {
        tr = document.createElement('tr');
      }
      if (this.lastConfSize > confs.length) {
        [...this.headers].forEach((header, i) => {
          if (i <= (this.lastConfSize - 1)) {
            if (tr) {
              tr.removeChild(header);
            }
            this.headers.splice(i, 1);
          }
        });
      }
      confs.forEach((conf: Conf, i: number) => {
        let th: HTMLTableHeaderCellElement;
        if (this.headers[i]) {
          th = this.headers[i];
        } else {
          th = document.createElement('th');
          if (this.stickyHeader) {
            th.classList.add('sticky');
          }
          this.headers.push(th);
        }
        if (conf.columnStyle) {
          th.setAttribute('style', conf.columnStyle);
        } else {
          th.setAttribute('style', '');
        }
        if (this.stickyHeader) {
          th.style.zIndex = `${confs.length - i}`;
        }
        if (conf && conf.renderHeader) {
          render(conf.renderHeader({ header: conf.header, property: conf.property }), th);
        } else {
          render(conf.header, th);
        }
        if (tr) {
          tr.appendChild(th);
        }
      });
      if (this.shadowRoot) {
        const thead = this.shadowRoot.querySelector('thead');
        if (thead) {
          thead.appendChild(tr);
        }
      }
    }
  }

  trCreated(tr: HTMLTableRowElement, lineIndex: number, item: any) {
    this.dispatchEvent(new CustomEvent('tr-create', { detail: { tr, lineIndex, item } }));
  }

  createTr(lineIndex: number) {
    const tr = document.createElement('tr');
    if (!this.table[lineIndex]) {
      this.table[lineIndex] = { element: tr, columns: [] };
    }
    return tr;
  }

  createTd(lineIndex: number) {
    const td = document.createElement('td') as HTMLTableCellElement;
    this.table[lineIndex].columns.push(td);
    return td;
  }

  cleanTrElements() {
    const splices = this.table.splice(this.data.length);

    splices.forEach((line: TableElement) => {
      if (line?.element?.parentNode) {
        line.element.parentNode.removeChild(line.element);
      }
    });
  }

  cleanTdElements(confs: Array<Conf>) {
    [...this.table].forEach((line) => {
      const splicedColumns = line.columns.splice(confs.length);

      splicedColumns.forEach((column) => {
        line.element.removeChild(column);
      });
    });
  }

  extractData(item: any, columnProperty: string) {
    if (columnProperty) {
      const splittedProperties = columnProperty.split('.');
      if (splittedProperties.length > 1) {
        return splittedProperties.reduce((prevRow: any, p: string) => {
          if (typeof prevRow === 'string' && item[prevRow] !== undefined && item[prevRow][p] !== undefined) {
            return item[prevRow][p];
          }

          return prevRow[p] || '';
        });
      }
      return item[columnProperty];
    }
    return null;
  }

  renderCell(item: any, td: HTMLTableCellElement, conf: Conf) {
    if (conf?.render) {
      render(conf.render(
        { value: this.extractData(item, conf.property), item },
      ), td);
    } else if (conf.property) {
      render(this.extractData(item, conf.property), td);
    }
  }

  renderHtml(conf: Conf, item: any, td: HTMLTableCellElement, tr: HTMLTableRowElement) {
    this.renderCell(item, td, conf);
    tr.appendChild(td);
  }

  updateBody(confs: Array<Conf>) {
    if (this.data !== undefined) {
      if (this.lastConfSize > confs.length) {
        this.cleanTdElements(confs);
      }
      if (this.lastDataSize > this.data.length) {
        this.cleanTrElements();
      }
      this.data.forEach((item, lineIndex: number) => {
        let tr: HTMLTableRowElement;
        if (this.table[lineIndex]) {
          tr = this.table[lineIndex].element;
        } else {
          tr = this.createTr(lineIndex);
        }

        this.trCreated(tr, lineIndex, item);

        confs.forEach((conf, columnIndex) => {
          let td;
          if (this.table[lineIndex].columns[columnIndex]) {
            td = this.table[lineIndex].columns[columnIndex];
          } else {
            td = this.createTd(lineIndex);
          }

          if (conf.columnStyle) {
            td.setAttribute('style', conf.columnStyle);
          } else {
            td.setAttribute('style', '');
          }

          this.renderHtml(conf, item, td, tr);
        });
        if (this.shadowRoot) {
          const tbody = this.shadowRoot.querySelector('tbody');
          if (tbody) {
            tbody.appendChild(tr);
          }
        }
      });
    }
  }

  render() {
    return html`
      <slot></slot>
      <table id="table">
        <thead></thead>
        <tbody></tbody>
      </table>
    `;
  }
}
