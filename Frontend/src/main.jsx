import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const persons = [
  { name: "Arto Hellas", number: "040-123456" },
  { name: "Ada Lovelace", number: "39-44-5323523" },
  { name: "Dan Abramov", number: "12-43-234345" },
  { name: "Mary Poppendieck", number: "39-23-6423122" },
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App persons={persons} />
  </React.StrictMode>
);
