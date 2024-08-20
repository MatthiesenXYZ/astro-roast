
export const getPublicFonts = async (base: string, path: string) => {
    return await (await fetch(new URL(path, base))).arrayBuffer();
}