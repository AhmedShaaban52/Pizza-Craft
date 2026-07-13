// import { ProfileSidebar } from "./_components/Sidebar";

// export default function ProfileLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-[calc(100vh-64px)]">
//       <ProfileSidebar />
//       <main className="flex-1 overflow-auto">
//         {children}
//       </main>
//     </div>
//   );
// }


import { ProfileSidebar } from "./_components/Sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'flex-col md:flex-row' handles the mobile stacking vs desktop side-by-side
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-background">
      {/* Sidebar component contains both mobile tabs and desktop sidebar */}
      <ProfileSidebar />

      {/* Content area */}
      <main className="flex-1 overflow-auto w-full">
        {children}
      </main>
    </div>
  );
}