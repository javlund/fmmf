import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';

class TestComponent extends React.Component {
  render() {
    return <h1>Hello world</h1>;
  }
}

//(() => {
  ReactDOM.render(
    <Table width={300} rowsCount={5} rowHeight={30} headerHeight={40} height={500} />,
    document.getElementById('dataTable')
  );
//})();

// Table data as a list of array.
/*const rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3']
];

var table = <Table
    rowHeight={50}
    rowsCount={rows.length}
    width={5000}
    height={5000}
    headerHeight={50}>
    <Column
      header={<Cell>Col 1</Cell>}
      cell={<Cell>Column 1 static content</Cell>}
      width={2000}
    />
    <Column
      header={<Cell>Col 2</Cell>}
      cell={<Cell />}
      width={1000}
    />
    <Column
      header={<Cell>Col 3</Cell>}
      cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          Data for column 3: {rows[rowIndex][2]}
        </Cell>
      )}
      width={2000}
    />
  </Table>

// Render your table
(() => {
  ReactDOM.render(
    table,
    document.getElementById('dataTable')
  );
})();
*/
