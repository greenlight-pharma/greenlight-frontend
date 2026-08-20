import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import {
  getToken,
  getDoctor,
  setSession,
  clearSession,
  onSessionExpired,
} from "../../lib/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [doctor, setDoctor] = useState(() => (getToken() ? getDoctor() : null));
  // Mensagem mostrada na tela de login quando a saída não foi voluntária.
  const [expiredNotice, setExpiredNotice] = useState("");

  const logout = useCallback(
    (notice = "") => {
      clearSession();
      setDoctor(null);
      setExpiredNotice(notice);
      queryClient.clear(); // nenhum dado de paciente sobrevive à troca de sessão
    },
    [queryClient]
  );

  // [SESSAO-EXPIRADA] Um único ouvinte pro app inteiro. Qualquer 401, em
  // qualquer tela, cai aqui: derruba a sessão e explica o motivo. Antes o
  // médico via só "Erro ao cadastrar" e reclicava sem entender.
  useEffect(
    () =>
      onSessionExpired(() =>
        logout("Sua sessão expirou por inatividade. Entre novamente para continuar.")
      ),
    [logout]
  );

  const login = useCallback(async (email, password) => {
    // Uma nova tentativa apaga o aviso de sessão expirada: ele explica por que
    // o médico voltou ao login, não o resultado do que ele está fazendo agora.
    setExpiredNotice("");
    const data = await api.post("/auth/login", { email, password }, { auth: false });
    if (!data?.token) throw new Error("Resposta de login inválida do servidor.");
    const info = {
      id: data.doctor?.id,
      name: data.doctor?.name || data.name || "",
      email: data.doctor?.email || email,
      role: data.doctor?.role || data.role || "",
    };
    setSession(data.token, info);
    setDoctor(info);
    setExpiredNotice("");
    return info;
  }, []);

  return (
    <AuthContext.Provider
      value={{ doctor, isLoggedIn: !!doctor, login, logout, expiredNotice }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
