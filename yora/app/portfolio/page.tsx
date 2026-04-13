export default function Portfolio() {
  return (
    <div className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-6">
        Creative Portfolio
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="border rounded-lg p-4 shadow">
          <img src="/sample1.jpg" alt="portfolio" className="rounded" />
          <p className="mt-2 font-semibold">Fashion Shoot</p>
        </div>

        <div className="border rounded-lg p-4 shadow">
          <img src="/sample2.jpg" alt="portfolio" className="rounded" />
          <p className="mt-2 font-semibold">Music Video</p>
        </div>

        <div className="border rounded-lg p-4 shadow">
          <img src="/sample3.jpg" alt="portfolio" className="rounded" />
          <p className="mt-2 font-semibold">Brand Design</p>
        </div>

      </div>

    </div>
  )
}