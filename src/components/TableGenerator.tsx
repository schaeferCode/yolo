import { Holding } from "./DataTable";

const TableGenerator = ({ positions, signature }: { signature: string, positions: (Holding & { ticker_symbol?: string | null })[] }) => {
  // Dynamically generate the table
  const generateTableString = () => {
    const headers = ["Security", "Quantity", "Cost Basis"];
    const rows = positions.map((pos) => [
      pos.ticker_symbol || "N/A",
      pos.quantity.toFixed(0) || "0",
      `$${pos.cost_basis?.toFixed(2) || "0.00"}`,
    ]);

    // Calculate column widths
    const columnWidths = headers.map((header, colIndex) =>
      Math.max(
        header.length,
        ...rows.map((row) => row[colIndex].length)
      )
    );

    // Create formatted table rows
    const formattedHeader = headers
      .map((header, index) => header.padEnd(columnWidths[index]))
      .join(" | ");
    const separator = columnWidths.map((width) => "-".repeat(width)).join("-+-");
    const formattedRows = rows.map((row) =>
      row.map((cell, index) => cell.padEnd(columnWidths[index])).join(" | ")
    );

    // Combine table content
    const tableContent = [formattedHeader, separator, ...formattedRows].join("\n");

    // Create a border of `*` with the signature embedded
    const totalWidth =
      columnWidths.reduce((sum, width) => sum + width, 0) +
      columnWidths.length * 3 - // Account for " | " separators
      1; // Adjust for outer edges
    
    const borderTop = "*".repeat(totalWidth + 2);
    const borderBottom = "*".repeat(totalWidth + 2);
    const signatureLine = `signed: ${signature}`
    //   // Create signature characters distributed vertically along the right side of the table
    // let signatureLines: string[] = [];
    // let signatureIndex = 0;

    // // Add signature characters to the end of each row
    // for (let i = 0; i < rows.length; i++) {
    //   let line = formattedRows[i];
    //   line = `${line} ${signature[signatureIndex] || " "}`; // Append signature character
    //   signatureLines.push(line);
    //   signatureIndex++;
    // }

    // // Add any remaining signature characters after all rows
    // const remainingSignature = signature.slice(signatureIndex);
    // const footer = `* ${"*".repeat(columnWidths.reduce((sum, width) => sum + width, 0) + columnWidths.length * 3)}${remainingSignature}`;

    // // Combine everything to create the final table
    // return `* ${formattedHeader} *\n* ${separator} *\n* ${signatureLines.join("\n* ")} *\n${footer}`;

    return `${borderTop}\n* ${tableContent.split("\n").join(" *\n* ")} *\n${borderBottom}\n${signatureLine}`;
  }

  // Render table and signature
  return (
    <div style={{ fontFamily: "roboto", padding: "20px" }}>
      <pre style={{ background: "#f4f4f4", padding: "10px" }}>
        {generateTableString()}
      </pre>
    </div>
  );
};

export default TableGenerator;
