// Mirrors existing required-field limits; never infers missing clinical data.
export function caseReviewIssues(form) {
  return [
    ['queixaPrincipal', 'Queixa principal', 3],
    ['hma', 'História e evolução', 20],
  ].filter(([key, , min]) => (form[key] || '').trim().length < min)
    .map(([key, label, min]) => ({key, label, message: `Complete este campo com pelo menos ${min} caracteres.`}));
}
