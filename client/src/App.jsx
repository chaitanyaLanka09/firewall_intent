import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Activity, Smartphone, LayoutGrid, ServerCrash } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AppAnalysis from './pages/AppAnalysis';
import BlackBox from './pages/BlackBox';
import Behavior from './pages/Behavior';
import AppsPage from './pages/AppsPage';

function TopNav() {
  const location = useLocation();
  const links = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/apps', icon: Smartphone, label: 'Apps' },
    { to: '/analysis', icon: ShieldCheck, label: 'Analysis' },
    { to: '/blackbox', icon: ServerCrash, label: 'Black Box' },
    { to: '/behavior', icon: Activity, label: 'Behavior' },
  ];

  return (
    <div className="w-full bg-surface border-b border-borderSubtle flex items-center justify-between px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-textPrimary" />
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tight text-[16px] text-textPrimary uppercase">App Intent Firewall</h1>
            <span className="text-[11px] text-textSecondary uppercase tracking-widest font-mono">AI Device Security</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all text-[13px] uppercase tracking-wide font-medium ${
                  active 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-allow/10 border border-allow/30 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.1)]">
          <div className="w-2 h-2 rounded-full bg-allow animate-pulse"></div>
          <span className="text-[11px] font-mono text-allow font-bold uppercase tracking-widest">Protection Active</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/analysis" element={<AppAnalysis />} />
            <Route path="/blackbox" element={<BlackBox />} />
            <Route path="/behavior" element={<Behavior />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
