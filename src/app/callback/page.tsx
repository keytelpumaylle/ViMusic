"use client"; // Asegúrate de que se ejecute solo en el cliente

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getToken } from "../api/autorizer";

const CallbackPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extraemos el parámetro "code" de la URL solo una vez
    const codeFromUrl = searchParams.get("code");

    if (codeFromUrl && codeFromUrl !== code) {
      setCode(codeFromUrl); // Solo actualizar el estado si el código ha cambiado
      console.log("Código recibido desde la URL:", codeFromUrl);

      // Ejecutamos getToken solo cuando codeFromUrl esté disponible
      getToken(codeFromUrl)
        .then(() => {
          // Redirige automáticamente a la página principal después de obtener el token
          window.location.href = "/"; // Usamos window.location.href para redirigir
        })
        .catch((error) => {
          console.error("Error al obtener el token:", error);
        });
    }
  }, [searchParams, code]); // Se ejecuta cuando los searchParams cambian

  return <div>Cargando...</div>; // Indicador mientras se realiza la acción
};

export default CallbackPage;
