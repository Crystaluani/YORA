export default function PortfolioGrid() {
  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="border rounded-lg p-4 shadow">
        <img src="/sample1.jpg" className="rounded" />
        <p className="mt-2 font-semibold">Fashion Shoot</p>
      </div>

      <div className="border rounded-lg p-4 shadow">
        <img src="/sample2.jpg" className="rounded" />
        <p className="mt-2 font-semibold">Music Video</p>
      </div>

      <div className="border rounded-lg p-4 shadow">
        <img src="/sample3.jpg" className="rounded" />
        <p className="mt-2 font-semibold">Brand Design</p>
      </div>

    </div>
  )
}