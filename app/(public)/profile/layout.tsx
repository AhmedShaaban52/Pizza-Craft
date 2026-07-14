import { ProfileSidebar } from "./_components/Sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-background">
      <ProfileSidebar />

      <main className="flex-1 overflow-auto w-full">
        {children}
      </main>
    </div>
  );
}