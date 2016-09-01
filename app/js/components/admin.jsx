import React from 'react';
import FixedDataTable from 'fixed-data-table';
import 'whatwg-fetch';

const {Table, Column, Cell} = FixedDataTable;


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch('/php/members')
      .then(response => {
        this.setState({
          data: response.status == 200 ? response.body : []
        })
      });
  }

  render() {
    return (
      <div>
        <Table
          width={1000}
          height={400}
          rowHeight={50}
          headerHeight={50}
          rowsCount={this.state.data.length}
        >
          <Column
            header={<Cell>Navn</Cell>}
            cell={({rowIndex}) => (
              <Cell>{this.state.data[rowIndex].name}</Cell>
            )}
            width={200}
          />
          <Column
            header={<Cell>E-mail</Cell>}
            width={200}
          />
        </Table>
      </div>
    );
  }
}

export default Admin;
