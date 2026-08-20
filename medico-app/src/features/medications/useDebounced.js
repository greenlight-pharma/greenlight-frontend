import { useEffect, useState } from "react";

// Atrasa a propagação do valor. Substitui os 4 pares de
// let xSearchTimer / clearTimeout / setTimeout que o medico.html repetia
// (um por campo com autocomplete), cada um com seu delay diferente.
export default function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
