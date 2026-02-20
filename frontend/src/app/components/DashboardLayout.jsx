import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, FileText, Sparkles, BarChart3, Mail, Settings, LogOut, FolderOpen, Layout } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const navigation = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "My Resumes", href: "/app/resumes", icon: FolderOpen },
    { name: "Resume Templates", href: "/app/templates", icon: Layout },
    { name: "Resume Builder", href: "/app/builder", icon: Sparkles },
    { name: "Resume Analysis", href: "/app/analysis", icon: BarChart3 },
    { name: "Cover Letter", href: "/app/cover-letter", icon: Mail },
  ];

  const isActive = (href) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold text-foreground">ResumeAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          {user && (
            <div className="mb-3 px-4 py-2">
              <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <div className="mb-3">
            <Link
              to="/app/settings"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                isActive("/app/settings")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}