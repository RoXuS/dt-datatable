import { css } from 'lit-element';

export default css`
  :host {
    display: block;
  }

  slot {
    display: none;
  }

  table {
    width: 100%;
    border-spacing: 0px;
    border-collapse: seperate;
  }

  th {
    background: var(--dt-datatable-th-background, white);
    color: var(
      --dt-datatable-th-color,
      rgba(0, 0, 0, var(--dark-secondary-opacity))
    );
    text-align: left;
    white-space: nowrap;

    font-weight: var(--dt-datatable-api-header-weight, 500);
    font-size: var(--dt-datatable-api-header-font-size, 12px);
    padding: var(--dt-datatable-api-header-padding, 6px 26px);

    border-bottom: 1px solid;
    border-color: var(
      --dt-datatable-divider-color,
      rgba(0, 0, 0, 0.12)
    );
  }

  th.sticky {
    position: sticky;
    background: var(--dt-datatable-th-background, white);
    top: 0;
    z-index: 1;
  }

  tbody td {
    height: var(--dt-datatable-api-body-td-height, 56px);
  }

  tbody tr {
    height: var(--dt-datatable-api-body-tr-height, 56px);
  }

  thead tr {
    height: var(--dt-datatable-api-header-tr-height, 56px);
  }

  thead th {
    height: var(--dt-datatable-api-header-th-height, 56px);
  }

  tbody tr:nth-child(even) {
    background-color: var(--dt-datatable-api-tr-even-background-color, none);
  }

  tbody tr:nth-child(odd) {
    background-color: var(--dt-datatable-api-tr-odd-background-color, none);
  }

  tbody tr:hover {
    background: var(--dt-datatable-api-tr-hover-background-color, none);
  }

  tbody tr.selected {
    background-color: var(
      --dt-datatable-api-tr-selected-background,
      var(--paper-grey-100)
    );
  }

  td {
    font-size: 13px;
    font-weight: normal;
    color: var(--dt-datatable-td-color, #575962);
    padding: 6px var(--dt-datatable-api-horizontal-padding, 26px);
    cursor: var(--dt-datatable-api-td-cursor, inherit);
    height: 36px;
  }

  tbody tr:not(:first-child) td {
    border-top: var(--dt-datatable-api-td-border-top, 1px solid);
    border-color: var(
      --dt-datatable-divider-color,
      rgba(0, 0, 0, 0.12)
    );
  }
`;
