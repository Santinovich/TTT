
export const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeoutCallback: () => void = () => { },
    timeout: number = 5000
) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        timeoutCallback();
        throw new Error("Timeout");
    }
};
