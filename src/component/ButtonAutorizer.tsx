"use client";
//import { getToken } from "@/app/api/getToken";
import { authorize, getToken } from "@/app/api/autorizer";
import { useEffect, useState } from "react";

export default function ButtonAutorizer() {
  const [codeVerifier, setCodeVerifier] = useState("");
  
  useEffect(()=>{
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
    
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    console.log(code);
    
  })
  return (
    <button onClick={authorize} className="bg-green-400 p-4 rounded-sm">Autorizar</button>
  );
}