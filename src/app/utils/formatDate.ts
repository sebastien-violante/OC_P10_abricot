/**
 * Renvoie une date au format DD month et une heure au format hh:min en fonction d'une date fournie
 * @param {string} createdAT - date au format chaine de caractère ISO
 * @returns {string} - date et heure
*/
export function formatDateWithHour(createdAt: string | Date) {
  const date = new Date(createdAt);

  // Extraction de la partie jour et mois
  const datePart = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);

  // Extraction de la partie heure minute
  const timePart = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${datePart}, ${timePart}`;
}