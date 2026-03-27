/**
 * @fileoverview Available colors for folders.
 */

/**
 * @typedef {Object} FolderColor
 * @property {string} label - Display name of the color (in French)
 * @property {string} value - CSS ID of the color
 */

/**
 * List of colors available to customize a folder.
 * Each color corresponds to a CSS variable in App.css.
 * @readonly
 * @enum {FolderColor}
 */
export const FOLDER_COLORS = {
    RED:    { label: "Rouge",   value: "red" },
    ORANGE: { label: "Orange",  value: "orange" },
    YELLOW: { label: "Jaune",   value: "yellow" },
    GREEN:  { label: "Vert",    value: "green" },
    BLUE:   { label: "Bleu",    value: "blue" },
    PURPLE: { label: "Violet",  value: "purple" },
    PINK:   { label: "Rose",    value: "pink" },
    TEAL:   { label: "Turquoise", value: "teal" },
    GRAY:   { label: "Gris",    value: "gray" },
    BROWN:  { label: "Marron",  value: "brown" },
};