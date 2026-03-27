/**
 * @fileoverview Colors associated with each task status.
 * Used by the PieChart component to color the slices.
 */

/**
 * Matching a task status to its display color.
 * The keys correspond to the TaskStatus values.
 * @type {Object.<string, string>}
 */
export const STATUS_COLORS = {
    "Nouveau":    "#7EB8D4",
    "En attente": "#F0A500",
    "En pause":   "#A98ED6",
    "Réussi":     "#6BBF84",
    "Abandonné":  "#D4756B",
};