export interface Holding {
  account_id: string;
  cost_basis: number;
  institution_price: number;
  institution_price_as_of: string;
  institution_price_datetime: string | null;
  institution_value: number;
  iso_currency_code: string;
  quantity: number;
  security_id: string;
  unofficial_currency_code: string | null;
  vested_quantity: number | null;
  vested_value: number | null;
}

const DataTable = ({ holdings, selectedRows, handleRowSelect }: { holdings: Holding[], selectedRows: string[], handleRowSelect: (secId: string) => void }) => {
  return (
    <div>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th />
            <th>Cost Basis</th>
            <th>Institution Price</th>
            <th>ISO Currency Code</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(({ security_id, cost_basis, institution_price, quantity, iso_currency_code }) => (
            <tr key={security_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(security_id)}
                  onChange={() => handleRowSelect(security_id)}
                />
              </td>
              <td>{cost_basis}</td>
              <td>{institution_price}</td>
              <td>{iso_currency_code}</td>
              <td>{quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Selected Rows: {selectedRows.join(", ")}</p>
    </div>
  );
};

export default DataTable;
