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
    <div className="w-full bg-surface border-b border-borderSubtle flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-50 gap-4 md:gap-0">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-textPrimary shrink-0" />
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tight text-[16px] text-textPrimary uppercase whitespace-nowrap">App Intent Firewall</h1>
            <span className="text-[11px] text-textSecondary uppercase tracking-widest font-mono">AI Device Security</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 justify-center md:justify-start custom-scrollbar">
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all text-[12px] md:text-[13px] uppercase tracking-wide font-medium whitespace-nowrap ${
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-allow/10 border border-allow/30 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.1)] shrink-0">
          <div className="w-2 h-2 rounded-full bg-allow animate-pulse"></div>
          <span className="text-[11px] font-mono text-allow font-bold uppercase tracking-widest whitespace-nowrap">Protection Active</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 w-full flex flex-col">
        <div className="max-w-[1400px] mx-auto w-full flex-1">
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
