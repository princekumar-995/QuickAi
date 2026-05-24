


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

// export default import React from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Scissors, SquarePen, Image, Users, Sparkles, BookOpen, ShieldAlert } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.primaryEmailAddress?.emailAddress?.includes('admin') || 
                  user?.id === 'user_2yMX02PRbyMtQK6PebpjnxvRNIA';

  const menuItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/blogs', label: 'Explore Blogs', Icon: BookOpen },
    { to: '/ai/create-blog/editor', label: 'Blog Editor', Icon: SquarePen },
    ...(isAdmin ? [{ to: '/ai/admin-dashboard', label: 'Admin Panel', Icon: ShieldAlert }] : []),
    { to: '/ai/codeflow', label: 'CodeFlow', Icon: Sparkles },
    { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
  ];

  return (
    <div
      className={`w-64 glass border-r border-white/20 flex flex-col justify-between 
        sm:static sm:translate-x-0 fixed top-14 bottom-0 z-40 transform 
        ${sidebar ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
    >
      <div className='flex overflow-hidden flex-col h-full'>
        {/* 👤 User Info */}
        <div className='my-8 relative text-center px-4'>
           {/* Decorative background glow behind avatar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
          
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className='w-16 h-16 rounded-full mx-auto mb-3 shadow-md relative z-10 border-2 border-white'
          />
          <h1 className='font-bold text-white mb-0.5'>{user?.fullName}</h1>
          <p className='text-xs text-gray-400 font-medium truncate max-w-full'>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        {/* 🧭 Nav Links */}
        <div className='flex-1 w-full px-4 space-y-1 overflow-y-auto pb-4 custom-scrollbar'>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-3 mb-3 mt-2">Tools</p>
          {menuItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer
                ${isActive
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className='w-4 h-4' />
              <span className='text-sm font-medium'>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ⚙️ Bottom Buttons */}
      <div className='border-t border-white/10 w-full p-4 flex flex-col space-y-2 bg-gradient-to-b from-transparent to-black/35'>
        {/* Profile Button */}
        <button
          onClick={openUserProfile}
          className='flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-left border border-transparent hover:border-white/10 hover:shadow-sm group'
        >
          <img src={user?.imageUrl} className='w-9 h-9 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all' alt="User Avatar" />

          <div className='flex flex-col items-start overflow-hidden'>
            <h1 className='text-sm font-semibold text-white leading-tight truncate w-full'>
              {user?.fullName}
            </h1>
            <p className='text-xs text-primary font-medium flex items-center gap-1 mt-0.5'>
              <Sparkles className="w-3 h-3" />
              <Protect plan='premium' fallback={<span>Free Plan</span>}><span>Premium</span></Protect> 
            </p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className='w-full text-sm font-medium text-red-500 hover:bg-red-950/20 py-2.5 rounded-xl transition-all duration-200'
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Sidebar
