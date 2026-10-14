/**
 * Resolves a file from public/ against Vite's base path, so the site works at "/" (own domain)
 * and under "/kariyer/" (proxied from kayra.technology). Example: asset("brand/kayra-emblem.svg").
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
