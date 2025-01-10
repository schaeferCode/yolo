import React, { useState } from "react";

const VerifyTableForm = () => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/verify-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: textAreaValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Success: ${data.isValid}`);
      } else {
        const error = await response.json();
        setResponseMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponseMessage(`Error: ${error.message}`);
      } else {
        setResponseMessage(`Error: ${error}`);
      }
    }
  };

  return (
    <div>
      <h1>Verify Table</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="data">Enter your data:</label>
          <textarea
            id="data"
            name="data"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            rows={5}
            cols={50}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default VerifyTableForm;
