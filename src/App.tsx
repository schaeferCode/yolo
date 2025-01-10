// import './App.css'

import { useEffect, useState } from "react"

import { Link } from './components'
import DataTable, { type Holding } from './components/DataTable'
import TableGenerator from './components/TableGenerator'
import VerifyTable from './components/VerifyTable'

const BASE_URL = 'http://localhost:3000'

function App() {
  const [linkToken, setLinkToken] = useState(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [signature, setSignature] = useState<string>();

  const handleRowSelect = (secId: string) => {
    setSelectedRows((prev) =>
      prev.includes(secId)
        ? prev.filter((id) => id !== secId)
        : [...prev, secId]
    );
  };

  const generateToken = async () => {
    const response = await fetch(`${BASE_URL}/api/create_link_token`, {
      method: 'POST'
    })
    const data = await response.json();
    setLinkToken(data.link_token);
  };
  useEffect(() => {
    generateToken();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const selectedHoldings = holdings.filter(({security_id}) => selectedRows.find((secId) => secId === security_id))

    try {
      const response = await fetch(`${BASE_URL}/api/generate-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedHoldings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log({result})
      setSignature(result.signature)
    } catch (err) {
      console.error("Error submitting data:", err);
      setError("Failed to submit data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      hello world!
      <br />
      { linkToken ? <Link linkToken={linkToken} setHoldings={setHoldings} /> : <span>no link token</span> }
      <br />

      <DataTable holdings={holdings} handleRowSelect={handleRowSelect} selectedRows={selectedRows} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Data"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <br/>

      {signature && (
        <TableGenerator positions={holdings.filter(({security_id}) => selectedRows.find((secId) => secId === security_id))} signature={signature} />
      )}

      <br />

      <VerifyTable />
    </>
  )
}

export default App
