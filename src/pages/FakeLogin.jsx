import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function FakeLogin() {
  const { token } = useParams();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const submit = async () => {
    await fetch(`http://localhost:5000/t/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token, u, p })
});
    window.location.href = "/education";
  };

  return (
    <div>
      <h2>Company Login</h2>
      <input onChange={(e)=>setU(e.target.value)} placeholder="Username"/>
      <input onChange={(e)=>setP(e.target.value)} type="password"/>
      <button onClick={submit}>Login</button>
    </div>
  );
}