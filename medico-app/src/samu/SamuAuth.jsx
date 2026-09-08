import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../features/auth/AuthContext.jsx";
import { setSession, clearSession, getToken, getDoctor, onSessionExpired } from "../lib/auth.js";
import { samuApi } from "./api.js";

// Preenche o MESMO contrato do AuthContext do painel médico, com outro login:
// registro profissional + senha, contra /samu/auth/login. Assim o Layout, o
// useAuth e o tratamento de sessão expirada servem aos dois sem cópia.
export function SamuAuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [profissional, setProfissional] = useState(() => (getToken() ? getDoctor() : null));
  const [expiredNotice, setExpiredNotice] = useState("");

  const logout = useCallback(
    (notice = "") => {
      clearSession();
      setProfissional(null);
      setExpiredNotice(notice);
      queryClient.clear();
    },
    [queryClient]
  );

  useEffect(
    () => onSessionExpired(() => logout("Sua sessão expirou. Entre novamente para continuar.")),
    [logout]
  );

  const login = useCallback(async (registro, senha) => {
    setExpiredNotice("");
    const data = await samuApi.login(registro, senha);
    if (!data?.token) throw new Error("Resposta de login inválida do servidor.");
    const info = {
      id: data.profissional?.id,
      // `name`/`email` são os campos que o Layout lê. Aqui o "e-mail" é o
      // registro profissional — é o que identifica a pessoa no SAMU.
      name: data.profissional?.nome || "",
      email: data.profissional?.registro || registro,
      baseId: data.profissional?.base_id ?? null,
      profissao: data.profissional?.profissao || "",
    };
    setSession(data.token, info);
    setProfissional(info);
    return info;
  }, []);

  return (
    <AuthContext.Provider
      value={{ doctor: profissional, isLoggedIn: !!profissional, login, logout, expiredNotice }}
    >
      {children}
    </AuthContext.Provider>
  );
}
