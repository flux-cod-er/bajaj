import { useState } from "react";
import Select from "react-select";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("{}");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        setError("Invalid JSON format. Ensure it has a 'data' array.");
        return;
      }
      setError("");
      
      const response = await fetch("https://your-backend-url.com/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
      });
      
      const result = await response.json();
      setResponseData(result);
    } catch (err) {
      setError("Invalid JSON. Please check the format.");
    }
  };

  return (
    <div className="container">
      <h1>Your Roll Number</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='{"data": ["M","1","334","4","B"]}'
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
      
      {responseData && (
        <>
          <Select
            options={options}
            isMulti
            onChange={(selected) => setSelectedFilters(selected.map((opt) => opt.value))}
          />
          <div className="response">
            <h3>Filtered Response</h3>
            {selectedFilters.includes("numbers") && <p>Numbers: {responseData.numbers.join(", ")}</p>}
            {selectedFilters.includes("alphabets") && <p>Alphabets: {responseData.alphabets.join(", ")}</p>}
            {selectedFilters.includes("highest_alphabet") && <p>Highest Alphabet: {responseData.highest_alphabet.join(", ")}</p>}
          </div>
        </>
      )}
    </div>
  );
}
