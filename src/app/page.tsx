"use client";
import { useEffect, useState } from "react";
import ButtonAutorizer from "@/component/ButtonAutorizer";
import Player from "@/component/Player";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenSpotify = sessionStorage.getItem("access_token");
    setToken(tokenSpotify);
  }, []);

  return (
    <div>
      {token ? <Player /> : <ButtonAutorizer />}
    </div>
  );
}