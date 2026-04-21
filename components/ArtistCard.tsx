import Link from "next/link"

type ArtistCardProps = {
  id: string
  name: string
  genre: string
}

export default function ArtistCard({ id, name, genre }: ArtistCardProps) {
  return (
    <Link href={`/artists/${id}`}>
      <div className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">{genre}</p>
      </div>
    </Link>
  )
}
