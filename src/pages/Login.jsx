import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    const res = await api.post("https://phishingscale-project.onrender.com/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    nav("/dashboard");
  };

  return (
    <div>
      <input onChange={(e)=>setEmail(e.target.value)} placeholder="email"/>
      <input type="password" onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}