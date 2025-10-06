import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Overlay para móvil */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        collapsed={sidebarCollapsed && !mobileMenuOpen} 
        onToggle={() => {
          if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
      />
      
      <div
        className={cn(
          "transition-all duration-300",
          isMobile ? "ml-0" : (sidebarCollapsed ? "ml-20" : "ml-64")
        )}
      >
        <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
