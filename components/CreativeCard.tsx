import Link from "next/link"

export default function CreativeCard({ id, name, role }: any) {
  return (
    <Link href={`/creatives/${id}`}>
      <div className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">{role}</p>
      </div>
    </Link>
    
  )
}
