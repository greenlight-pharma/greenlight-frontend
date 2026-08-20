import { useMemo } from "react";
import {
  isValidTime,
  POSOLOGIA_PRESETS,
  expandPosologia,
  serializeScheduleTimes,
} from "../lib/schedule.js";

// [HORARIOS] Editor de horários de lembrete.
//
// Herda o acerto do painel antigo — <input type="time">, que impede digitar
// "8;00" e abre teclado de hora no celular — e resolve três coisas que
// faltavam:
//
// 1. Atalho de posologia: o médico escolhe "de 8 em 8h" e os 3 horários
//    aparecem prontos. Antes ele fazia a conta de cabeça em consulta corrida.
// 2. Aviso de duplicata: dois horários iguais mandariam duas mensagens no
//    mesmo minuto pro paciente.
// 3. Prévia do que o paciente vai receber, na ordem em que vai receber.
//
// O componente é controlado: `times` é array de "HH:MM", e o pai guarda o
// estado. Não existe input escondido com string — a serialização pro backend
// acontece uma vez, no submit, via serializeScheduleTimes().
export default function TimesEditor({ times, onChange, legacyValue }) {
  const duplicates = useMemo(() => {
    const seen = new Set();
    const dup = new Set();
    for (const t of times) {
      if (!isValidTime(t)) continue;
      if (seen.has(t)) dup.add(t);
      seen.add(t);
    }
    return dup;
  }, [times]);

  const preview = serializeScheduleTimes(times);

  function setAt(index, value) {
    const next = [...times];
    next[index] = value;
    onChange(next);
  }

  function removeAt(index) {
    const next = times.filter((_, i) => i !== index);
    onChange(next.length ? next : [""]);
  }

  function applyPreset(presetId) {
    const base = times.find(isValidTime) || "08:00";
    const expanded = expandPosologia(base, presetId);
    if (expanded.length) onChange(expanded);
  }

  return (
    <div className="times-editor">
      {legacyValue && (
        <div className="legacy-warning">
          ⚠ Horário cadastrado em formato antigo ({legacyValue}). Informe os
          horários abaixo e salve para atualizar — enquanto isso o lembrete
          não dispara.
        </div>
      )}

      <div className="posologia-presets">
        <span className="small">Atalho:</span>
        {POSOLOGIA_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="preset-btn"
            onClick={() => applyPreset(p.id)}
            title={`Preenche os horários a partir do primeiro (${p.label})`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {times.map((value, index) => (
        <div className="time-row" key={index}>
          <input
            type="time"
            value={value || ""}
            onChange={(e) => setAt(index, e.target.value)}
            aria-label={`Horário ${index + 1}`}
          />
          <button
            type="button"
            className="remove-time"
            onClick={() => removeAt(index)}
            title="Remover este horário"
            aria-label={`Remover horário ${index + 1}`}
          >
            ×
          </button>
          {duplicates.has(value) && (
            <span className="time-warn">horário repetido</span>
          )}
        </div>
      ))}

      <button
        type="button"
        className="add-time-btn"
        onClick={() => onChange([...times, ""])}
      >
        + adicionar horário
      </button>

      {preview && (
        <div className="times-preview">
          O paciente receberá lembrete às <strong>{preview.split(",").join(" · ")}</strong>{" "}
          (horário de Brasília).
        </div>
      )}
    </div>
  );
}
