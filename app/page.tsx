import { getCategories } from '@/lib/gallery';
import CategoryCard from '@/app/components/CategoryCard';

export const dynamic = 'force-dynamic'; // Ensure we always scan for new folders on refresh

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="container min-h-screen py-10">
      <header className="mb-12 text-center">
        <h1 className="title mb-4">Gallery</h1>
        <p className="text-[#888]">Browse your collection by category</p>
      </header>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No categories found.</p>
          <p className="text-sm mt-2">Add folders to public/categories to get started.</p>
        </div>
      ) : (
        <div className="grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
  );
}
