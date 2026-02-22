export const escapeXml = (str: string) =>
    String(str).replace(
        /[&<>"']/g,
        (m) =>
            (
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&apos;'
                }) as Record<string, string>
            )[m] || m
    );

export const buildAbsoluteUrl = (path: string, base: string) => {
    try {
        return new URL(path, base).toString();
    } catch {
        // fallback to simple concatenation if base is invalid
        return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
};
