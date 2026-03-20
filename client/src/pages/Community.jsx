import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { dummyPublishedCreationData } from '../assets/assets'

const Community = () => {
  const [creations, setCreations] = useState([])

  useEffect(() => {
    // Dummy data fetch
    setCreations(dummyPublishedCreationData || [])
  }, [])

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold text-slate-800">Creations</h1>

      <div className="bg-white flex-1 w-full rounded-xl border border-gray-200 overflow-y-auto p-4">
        {creations?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creations.map((creation, index) => {
              const imgSrc = creation.image || creation.content
              const caption =
                creation.prompt || creation.caption || creation.title || ''
              const likes = index + 1 // 1, 2, 3

              return (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <img
                    src={imgSrc}
                    alt={`Creation ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />

                  {/* Hover caption overlay */}
                  {caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="line-clamp-2">{caption}</p>
                    </div>
                  )}

                  {/* Heart + Likes */}
                  <div className="absolute right-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 shadow-md">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{likes}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No creations yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
