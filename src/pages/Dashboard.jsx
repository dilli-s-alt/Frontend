import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/campaigns").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {data.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  );
}