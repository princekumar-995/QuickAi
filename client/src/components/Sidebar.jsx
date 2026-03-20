


// import React from 'react'
// import { Protect, useClerk, useUser } from '@clerk/clerk-react'
// import { Eraser, FileText, Hash, House, Scissors, SquarePen, Image, Users } from 'lucide-react'
// import { NavLink } from 'react-router-dom'

// const navItems = [
//   { to: '/ai', label: 'Dashboard', Icon: House },
//   { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
//   { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
//   { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
//   { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
//   { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
//   { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
//   { to: '/ai/community', label: 'Community', Icon: Users },
// ]

// const Sidebar = ({ sidebar, setSidebar }) => {
//   const { user } = useUser()
//   const { signOut, openUserProfile } = useClerk()

//   return (
//     <div
//       className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between 
//         sm:static sm:translate-x-0 fixed top-14 bottom-0 z-20 transform 
//         ${sidebar ? 'translate-x-0' : '-translate-x-full'} 
//         transition-transform duration-300 ease-in-out`}
//     >
//       {/* 👤 User Profile Section */}
//       <div className='my-7 text-center px-2'>
//         <img
//           src={user?.imageUrl}
//           alt="User Avatar"
//           className='w-16 h-16 rounded-full mx-auto mb-2'
//         />
//         <h1 className='font-semibold text-gray-800 text-sm'>{user?.fullName}</h1>
//         <p className='text-xs text-gray-500'>{user?.primaryEmailAddress?.emailAddress}</p>
//       </div>

//       {/* 🧭 Navigation Links */}
//       <div className='flex-1 w-full px-3 space-y-2 overflow-y-auto'>
//         {navItems.map(({ to, label, Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={to === '/ai'}
//             onClick={() => setSidebar(false)}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
//               ${isActive
//                 ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-sm'
//                 : 'text-gray-700 hover:bg-gray-100'
//               }`
//             }
//           >
//             <Icon className='w-4 h-4' />
//             <span className='text-sm font-medium'>{label}</span>
//           </NavLink>
//         ))}
//       </div>

//       {/* ⚙️ Bottom Buttons */}
//       <div className='border-t border-gray-200 w-full py-4 text-center space-y-2'>
//         <button
//           onClick={openUserProfile}
//           className='w-5/6 text-sm font-medium hover:bg-gray-100 py-2 rounded'
//         >
//           <img src={user.imageUrl} className='w-8 rounded-full' alt=""/>
//           <div>
//             <h1 className='text-sm font-medium'>{user.fullName}</h1>
//             <p className='text-xs text-grey-500'>
//               <Protect plan='premium' fallback="Free">Premium</Protect>Plan
//             </p>

//           </div>
//         </button>
//         <button
//           onClick={() => signOut()}
//           className='w-5/6 text-sm font-medium text-red-600 hover:bg-red-100 py-2 rounded'
//         >
//           Logout
//         </button>
//       </div>
//     </div>


//   )
// }

// export default Sidebar


import React from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Scissors, SquarePen, Image, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between 
        sm:static sm:translate-x-0 fixed top-14 bottom-0 z-20 transform 
        ${sidebar ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out`}
    >
      {/* 👤 User Info */}
      <div className='my-7 text-center px-2'>
        <img
          src={user?.imageUrl}
          alt="User Avatar"
          className='w-16 h-16 rounded-full mx-auto mb-2'
        />
        <h1 className='font-semibold text-gray-800 text-sm'>{user?.fullName}</h1>
        <p className='text-xs text-gray-500'>{user?.primaryEmailAddress?.emailAddress}</p>
      </div>

      {/* 🧭 Nav Links */}
      <div className='flex-1 w-full px-3 space-y-2 overflow-y-auto'>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/ai'}
            onClick={() => setSidebar(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className='w-4 h-4' />
            <span className='text-sm font-medium'>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* ⚙️ Bottom Buttons */}
      <div className='border-t border-gray-200 w-full py-4 flex flex-col items-center space-y-3'>
        {/* Profile Button */}
        <button
          onClick={openUserProfile}
          className='flex items-center gap-3 w-5/6 p-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 text-left'
        >
          <img src={user?.imageUrl} className='w-9 h-9 rounded-full' alt="User Avatar" />

          <div className='flex flex-col items-start'>
            <h1 className='text-sm font-semibold text-gray-800 leading-tight'>
              {user?.fullName}
            </h1>
            <p className='text-xs text-gray-500 leading-tight'>
              <Protect plan='premium' fallback="Free">Premium</Protect> Plan
            </p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className='w-5/6 text-sm font-medium text-red-600 hover:bg-red-100 py-2 rounded-lg transition-all duration-200'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
