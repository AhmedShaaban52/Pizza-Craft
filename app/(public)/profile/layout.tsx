import { ProfileSidebar } from "./_components/Sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <ProfileSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
