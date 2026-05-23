export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type StorageParser<T> = (rawValue: string) => T | null;
export type StorageSerializer<T> = (value: T) => string | null;
export type StorageCodec<T> = {
    parse: StorageParser<T>;
    serialize: StorageSerializer<T>;
};

export const STORAGE_KEYS = {
    theme: 'thinkin-blog:theme',
    sidebarCollapsed: 'thinkin-blog:sidebar:collapsed'
} as const;

export const stringStorage: StorageCodec<string> = {
    parse: (rawValue: string): string => rawValue,
    serialize: (value: string): string => value
};

export const booleanStorage: StorageCodec<boolean> = {
    parse: (rawValue: string): boolean | null => {
        if (rawValue === 'true') {
            return true;
        }

        if (rawValue === 'false') {
            return false;
        }

        return null;
    },
    serialize: (value: boolean): string => (value ? 'true' : 'false')
};

export function readStorage<T>(
    storage: Pick<Storage, 'getItem'>,
    key: string,
    parser: StorageParser<T>
): T | null {
    const rawValue = storage.getItem(key);
    return rawValue === null ? null : parser(rawValue);
}

export function writeStorage<T>(
    storage: Pick<Storage, 'setItem' | 'removeItem'>,
    key: string,
    value: T | null,
    serializer: StorageSerializer<T>
): void {
    const serializedValue = value === null ? null : serializer(value);

    if (serializedValue === null) {
        storage.removeItem(key);
        return;
    }

    storage.setItem(key, serializedValue);
}
