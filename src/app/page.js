export default function Home() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Motley</h1>
        <p className="text-xl mb-4">Your curated content hub</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold mb-2">Coming Soon:</p>
          <ul className="list-disc list-inside">
            <li>Social feed of others' lists</li>
            <li>Curated content recommendations</li>
            <li>Discover new podcasts, books, and more</li>
          </ul>
        </div>
      </div>
    );
  }