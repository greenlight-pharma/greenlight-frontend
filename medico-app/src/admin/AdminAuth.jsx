import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { getToken, getDoctor, setSession, clearSession, onSessionExpired } from "../lib/auth.js";

const Ctx = createContext(null);

export function AdminAuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [admin, setAdmin] = useState(() => (getToken() ? getDoctor() : null));
  const [expiredNotice, setExpiredNotice] = useState("");

  const logout = useCallback(
    (notice = "") => {
      clearSession();
      setAdmin(null);
      setExpiredNotice(notice);
      queryClient.clear(); // nenhum dado de paciente sobrevive à troca de sessão
    },
    [queryClient]
  );

  // Mesmo tratamento de 401 do painel médico: em vez de um erro genérico no
  // meio de uma ação, o admin sabe que a sessão caiu e por quê.
  useEffect(
    () =>
      onSessionExpired(() =>
        logout("Sua sessão expirou por inatividade. Entre novamente para continuar.")
      ),
    [logout]
  );

  const login = useCallback(async (email, password) => {
    setExpiredNotice("");
    const data = await api.post("/admin/login", { email, password }, { auth: false });
    if (!data?.token) throw new Error("Resposta de login inválida do servidor.");
    const info = { email, role: "admin" };
    setSession(data.token, info);
    setAdmin(info);
    return info;
  }, []);

  return (
    <Ctx.Provider value={{ admin, isLoggedIn: !!admin, login, logout, expiredNotice }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminAuth precisa estar dentro de <AdminAuthProvider>");
  return c;
}
