// bc is a shorthand for `BraveCache`

/**
 * Get value from function or return default value
 * @param value
 */
export function bc_getDefaultValue<T>(value: T | (() => T)): T {
    if (value && typeof value === "function") {
        return (value as () => T)();
    }

    return value;
}
