const modules = import.meta.glob('./mockImages/*.{png,jpg,jpeg,webp}', { eager: true });
export const mockImages = Object.values(modules).map((mod) => mod.default);
