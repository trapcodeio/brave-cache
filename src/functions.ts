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

/**
 * Remove prefix from object keys
 * @param prefix
 * @param prefixSeparator
 * @param items
 */
export function bc_removePrefixFromObjectKeys(
    items: Record<string, any>,
    prefix: string,
    prefixSeparator: string
) {
    for (const key in items) {
        items[key.replace(prefix + prefixSeparator, "")] = items[key];
        delete items[key];
    }

    return items;
}
