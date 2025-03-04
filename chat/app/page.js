"use client"
import { useState } from "react";

export default function Home() {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunAgent = async () => {
    if (!command.trim()) {
      alert("Please enter a command.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse("Error: " + data.detail);
      }
    } catch (error) {
      setResponse("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black-100">
      <h1 className="text-2xl font-bold mb-4">Selenium Agent UI</h1>
      <textarea
        className="w-full max-w-lg p-2 border rounded"
        rows="4"
        placeholder="Enter your command..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <button
        onClick={handleRunAgent}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Agent"}
      </button>
      {response && (
        <div className="mt-4 p-3 border bg-white w-full max-w-lg rounded">
          <h2 className="font-semibold">Response:</h2>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
}
