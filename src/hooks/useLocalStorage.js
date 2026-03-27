/**
 * @fileoverview Custom hook to synchronize React state with localStorage.
 */

import { useState, useEffect } from "react";

/**
 * Hook that functions like useState but persists the value in localStorage.
 * The value is automatically restored on page reload.
 * @template T
 * @param {string} key - The key used in localStorage
 * @param {T} initialValue - The default value if nothing is saved
 * @returns {[T, Function]} The [value, setter] tuple as useState
 * @example
 * const [isDark, setIsDark] = useLocalStorage("dark_mode", false);
 * // isDark will be restored to true on reload if the user had enabled it
 */

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try { return JSON.parse(saved); }
            catch { return initialValue; }
        }
        return initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}