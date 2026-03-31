let cache: { data: any, timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getGistCache = () => {
    if (cache && (Date.now() - cache.timestamp < CACHE_TTL)) {
        return cache.data;
    }
    return null;
};

export const setGistCache = (data: any) => {
    cache = { data, timestamp: Date.now() };
};

export const clearGistCache = () => {
    cache = null;
};
