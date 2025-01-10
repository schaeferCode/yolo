import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { type Holding } from './DataTable'

export const Link = ({ linkToken, setHoldings }: { linkToken: string, setHoldings: (holdings: Holding[]) => void }) => {
  const onSuccess: PlaidLinkOnSuccess = async (public_token, _metadata) => {
    const res = await fetch(`http://localhost:3000/api/holdings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token }),
    })
    const { holdings, securities } = await res.json() as { holdings: Holding[], securities: { security_id: string, ticker_symbol: string | null }[] }

    const thing = holdings.reduce((final, holding) => {
      const security = securities.find(({ security_id }) => security_id === holding.security_id)
      final.push({ ...holding, ticker_symbol: security?.ticker_symbol })
      return final
    }, [] as (Holding & { ticker_symbol?: string | null })[])

    setHoldings(thing)
  }
  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};
