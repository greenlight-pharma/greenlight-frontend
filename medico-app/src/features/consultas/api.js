import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

export function useMyAppointments() {
  return useQuery({
    queryKey: ["consultas"],
    queryFn: () => api.get("/my-appointments"),
  });
}

export function useDraftSoap(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.patch(`/appointments/${id}/draft-soap`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consultas"] }),
  });
}

export function useConcludeAppointment(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.patch(`/appointments/${id}/conclude`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consultas"] }),
  });
}

export function useReopenAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/appointments/${id}/reopen`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consultas"] }),
  });
}
