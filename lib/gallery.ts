import fs from 'fs';
import path from 'path';

export interface Image {
    id: string;
    filename: string;
    path: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string; // Path to the first image
    images: Image[];
    imageCount: number;
}

const CATEGORIES_DIR = path.join(process.cwd(), 'public/categories');

// Extensions to look for
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.gif', '.avif'];

export async function getCategories(): Promise<Category[]> {
    if (!fs.existsSync(CATEGORIES_DIR)) {
        return [];
    }

    const entries = await fs.promises.readdir(CATEGORIES_DIR, { withFileTypes: true });

    const categories: Category[] = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const categoryPath = path.join(CATEGORIES_DIR, entry.name);
            const images = await getImagesInDir(categoryPath, entry.name);

            categories.push({
                id: entry.name,
                name: entry.name,
                thumbnail: images.length > 0 ? images[0].path : undefined,
                images: images,
                imageCount: images.length
            });
        }
    }

    return categories;
}


export async function getCategory(slug: string): Promise<Category | null> {
    const decodedSlug = decodeURIComponent(slug);
    const categoryPath = path.join(CATEGORIES_DIR, decodedSlug);

    if (!fs.existsSync(categoryPath)) {
        return null;
    }

    const images = await getImagesInDir(categoryPath, decodedSlug);

    return {
        id: decodedSlug, // Use decoded name for ID/Display
        name: decodedSlug,
        thumbnail: images.length > 0 ? images[0].path : undefined,
        images: images,
        imageCount: images.length
    };
}

async function getImagesInDir(dirPath: string, categoryName: string): Promise<Image[]> {
    try {
        const files = await fs.promises.readdir(dirPath);

        return files
            .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => {
                const ext = path.extname(file).toLowerCase();
                const isHeic = ext === '.heic';

                // Base path relative to public
                const relPath = `/categories/${encodeURIComponent(categoryName)}/${encodeURIComponent(file)}`;

                return {
                    id: file,
                    filename: file,
                    // If HEIC, point to API route with decoding so the server finds the file
                    // If standard image, use direct public path
                    path: isHeic
                        ? `/api/image?file=/categories/${encodeURIComponent(categoryName)}/${encodeURIComponent(file)}`
                        : relPath
                };
            });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return [];
    }
}
