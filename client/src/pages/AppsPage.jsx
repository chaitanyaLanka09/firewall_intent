import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Smartphone, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getApps()
      .then(res => setApps(res.data))
      .catch(err => setError('Failed to load apps.'));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b border-borderSubtle pb-4">
        <Smartphone className="text-textSecondary w-6 h-6" />
        <div>
          <h1 className="text-xl font-mono font-bold text-textPrimary tracking-tight uppercase">Protected Application Registry</h1>
          <p className="text-xs text-textSecondary font-mono uppercase tracking-wider">Monitored Sandbox Integrity</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-block/10 border border-block/20 text-block text-sm font-mono rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map(app => {
          return (
            <div key={app._id} className="bg-surface rounded-lg border border-borderSubtle overflow-hidden flex flex-col group hover:border-textSecondary transition-colors">
              <div className="p-4 border-b border-borderSubtle bg-background/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-borderSubtle bg-surfaceHighlight flex items-center justify-center text-textSecondary font-mono font-bold text-sm">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-textPrimary font-mono uppercase tracking-wider">{app.name}</h3>
                    <div className="text-[10px] text-textSecondary font-mono tracking-wider">{app.packageName}</div>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-allow" />
              </div>

              <div className="p-5 flex-1 grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-1">Category</div>
                  <div className="text-sm font-mono text-textPrimary">{app.category}</div>
                </div>
                
                <div>
                  <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-1">Risk State</div>
                  <div className="text-sm font-mono font-bold text-allow">
                    MONITORED
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-1">Normal Permissions</div>
                  <div className="flex flex-wrap gap-2">
                    {app.normalPermissions.length > 0 ? (
                      app.normalPermissions.map(p => (
                        <span key={p} className="text-[10px] font-mono border border-borderSubtle bg-background text-textSecondary px-2 py-0.5 rounded uppercase tracking-wider">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-mono text-textSecondary italic">None</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-borderSubtle border-dashed">
                  <div>
                    <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-1">Baseline CPU</div>
                    <div className="text-xs font-mono text-textPrimary">{app.baselineBehavior.cpuActivity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-1">Baseline Net</div>
                    <div className="text-xs font-mono text-textPrimary">{app.baselineBehavior.networkActivity}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
