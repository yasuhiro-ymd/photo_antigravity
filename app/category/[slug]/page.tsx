import { getCategory } from '@/lib/gallery';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
    const params = await props.params;
    const category = await getCategory(params.slug);

    if (!category) {
        notFound();
    }

    return (
        <main className="container min-h-screen py-10">
            <div className="header-actions">
                <Link href="/" className="back-link">
                    ← Back to Collections
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="title capitalize">{category.name}</h1>
                <p className="text-[#888]">{category.imageCount} photos</p>
            </header>

            <div className="grid">
                {category.images.map((image) => (
                    <div key={image.id} className="image-grid-item">
                        <Image
                            src={image.path}
                            alt={image.filename}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
