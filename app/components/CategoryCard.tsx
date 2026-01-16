import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/gallery';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/category/${category.id}`} className="card">
            <div className="card-image-wrapper">
                {category.thumbnail ? (
                    <Image
                        src={category.thumbnail}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        No Image
                    </div>
                )}
            </div>
            <div className="card-content">
                <h2 className="card-title">{category.name}</h2>
                <p className="card-meta">{category.imageCount} items</p>
            </div>
        </Link>
    );
}
