import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
