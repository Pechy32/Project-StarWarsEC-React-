const API_URL = "https://swapi.dev/api";

const fetchData = async (url, requestOptions) => {
    const apiUrl = `${API_URL}${url}`;

    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

const fetchAllData = async (url) => {
    let results = [];
    let nextUrl = url;
    while (nextUrl) {
        const response = await fetchData(nextUrl, { method: "GET" });
        results = results.concat(response.results);
        nextUrl = response.next ? response.next.replace(API_URL, '') : null;
    }
    return results;
};

export const apiGet = (url) => {
    return fetchAllData(url);
};