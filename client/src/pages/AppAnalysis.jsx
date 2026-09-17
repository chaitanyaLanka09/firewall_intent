import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, AlertTriangle, ShieldAlert, Crosshair, HelpCircle, Info } from 'lucide-react';

const PERMISSIONS = ['CAMERA', 'MICROPHONE', 'LOCATION', 'CONTACTS', 'FILES', 'CLIPBOARD'];
const CONTEXTS = ['TAKING_PHOTO', 'RECORDING_AUDIO', 'NAVIGATION', 'CALCULATING', 'READING_NOTES', 'BROWSING', 'IDLE'];

export default function AppAnalysis() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('MICROPHONE');
  const [selectedContext, setSelectedContext] = useState('CALCULATING');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getApps()
      .then(res => {
        setApps(res.data);
        if (res.data.length > 0) setSelectedApp(res.data[0]._id);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load apps. Ensure backend is running.');
      });
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeRequest({
        appId: selectedApp,
        permission: selectedPermission,
        context: selectedContext
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze request.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level, type = 'text') => {
    if (level === 'CRITICAL' || level === 'BLOCK') return type === 'text' ? 'text-block' : 'border-block bg-block/10 text-block';
    if (level === 'HIGH') return type === 'text' ? 'text-block' : 'border-block bg-block/10 text-block';
    if (level === 'MEDIUM' || level === 'ASK') return type === 'text' ? 'text-ask' : 'border-ask bg-ask/10 text-ask';
    return type === 'text' ? 'text-allow' : 'border-allow bg-allow/10 text-allow';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b border-borderSubtle pb-4">
        <Crosshair className="text-textSecondary w-6 h-6" />
        <div>
          <h1 className="text-xl font-mono font-bold text-textPrimary tracking-tight uppercase">Permission Analysis</h1>
          <p className="text-xs text-textSecondary font-mono uppercase tracking-wider">Diagnostic Engine</p>
        </div>
      </div>

      <div className="bg-surface border border-borderSubtle rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-2">Target App</label>
          <select 
            value={selectedApp} 
            onChange={e => setSelectedApp(e.target.value)}
            className="w-full bg-background border border-borderSubtle text-textPrimary rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-textSecondary transition-colors"
          >
            {apps.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-2">Requested Permission</label>
          <select 
            value={selectedPermission} 
            onChange={e => setSelectedPermission(e.target.value)}
            className="w-full bg-background border border-borderSubtle text-textPrimary rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-textSecondary transition-colors"
          >
            {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-textSecondary uppercase font-mono tracking-wider mb-2">Current Context</label>
          <select 
            value={selectedContext} 
            onChange={e => setSelectedContext(e.target.value)}
            className="w-full bg-background border border-borderSubtle text-textPrimary rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-textSecondary transition-colors"
          >
            {CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !selectedApp}
            className="w-full bg-textPrimary hover:bg-white text-background font-mono font-bold uppercase tracking-wider rounded px-4 py-2 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-block/10 border border-block/20 text-block text-sm font-mono rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface rounded-lg border border-borderSubtle p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-[10px] text-textSecondary font-mono uppercase tracking-wider mb-2">Computed Risk Score</h3>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <span className={`text-6xl font-mono font-bold tracking-tighter ${getRiskColor(result.riskLevel)}`}>
                    {result.riskScore}
                  </span>
                  <span className="text-textSecondary font-mono text-xl">/ 100</span>
                </div>
                <div className={`mt-2 font-mono text-sm font-bold uppercase tracking-wider px-3 py-1 inline-block rounded border ${getRiskColor(result.riskLevel, 'badge')}`}>
                  {result.riskLevel}
                </div>
              </div>

              <div className="w-full md:w-px h-px md:h-24 bg-borderSubtle"></div>

              <div className="text-center md:text-right">
                <h3 className="text-[10px] text-textSecondary font-mono uppercase tracking-wider mb-2">System Recommendation</h3>
                <div className={`text-5xl font-mono font-bold tracking-tighter uppercase ${getRiskColor(result.recommendation)}`}>
                  {result.recommendation}
                </div>
                {result.recommendation === 'BLOCK' && <ShieldAlert className="w-8 h-8 text-block mx-auto md:ml-auto md:mr-0 mt-4" />}
                {result.recommendation === 'ASK' && <HelpCircle className="w-8 h-8 text-ask mx-auto md:ml-auto md:mr-0 mt-4" />}
                {result.recommendation === 'ALLOW' && <ShieldCheck className="w-8 h-8 text-allow mx-auto md:ml-auto md:mr-0 mt-4" />}
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden">
              <div className="p-4 border-b border-borderSubtle bg-background/50 flex items-center gap-2">
                <Info className="w-4 h-4 text-textSecondary" />
                <h3 className="text-xs font-mono font-bold text-textPrimary uppercase tracking-wider">Analysis Explanation</h3>
              </div>
              <div className="p-6 space-y-4">
                {result.reasons.length === 0 ? (
                  <div className="text-textSecondary font-mono text-sm">No abnormal signals detected. Request matches expected behavior patterns.</div>
                ) : (
                  <ul className="space-y-3">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex gap-3 text-textPrimary text-sm bg-background p-3 rounded border border-borderSubtle">
                        <AlertTriangle className="w-5 h-5 text-ask shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden">
              <div className="p-4 border-b border-borderSubtle bg-background/50">
                <h3 className="text-xs font-mono font-bold text-textPrimary uppercase tracking-wider">Score Breakdown</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Sensitivity', val: result.scoreBreakdown.permissionSensitivity, max: 20 },
                  { label: 'Context Mismatch', val: result.scoreBreakdown.contextMismatch, max: 20 },
                  { label: 'Hist. Anomaly', val: result.scoreBreakdown.historicalAnomaly, max: 15 },
                  { label: 'Perm. Combo', val: result.scoreBreakdown.permissionCombination, max: 15 },
                  { label: 'Behavior Change', val: result.scoreBreakdown.behavioralChange, max: 15 },
                  { label: 'Device Evidence', val: result.scoreBreakdown.deviceEvidence, max: 15 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-textSecondary uppercase font-mono tracking-wider">{item.label}</span>
                      <span className="font-mono text-xs text-textPrimary">{item.val} <span className="text-textSecondary opacity-50">/ {item.max}</span></span>
                    </div>
                    <div className="w-full bg-background h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.val > (item.max/2) ? 'bg-ask' : item.val > 0 ? 'bg-allow' : 'bg-borderSubtle'}`}
                        style={{ width: `${(item.val / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {result.behavioralChange && (
              <div className="bg-surface rounded-lg border border-block overflow-hidden">
                <div className="p-3 bg-block/10 border-b border-block/20">
                  <h3 className="text-[10px] font-mono font-bold text-block uppercase tracking-wider">Telemetry Alert</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs text-textPrimary font-mono">Abnormal Black Box evidence detected within the recent time window.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
