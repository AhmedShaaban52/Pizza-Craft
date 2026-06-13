import { Sidebar } from "@/app/(public)/_components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto p-8 transition-colors duration-200">
                {children}
            </main>
        </div>
    );
}