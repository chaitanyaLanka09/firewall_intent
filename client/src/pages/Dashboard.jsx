import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, ShieldAlert, Activity, ServerCrash, Smartphone, Crosshair, Cpu, Network, Battery, Target, BrainCircuit, AlertTriangle, Info, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RadialProgress = ({ percentage, colorClass, statusText }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[160px] h-[160px]">
      <svg className="w-full h-full transform -rotate-90">
        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <line
            key={i}
            x1="80"
            y1="8"
            x2="80"
            y2="14"
            transform={`rotate(${i * 10} 80 80)`}
            className="stroke-surfaceHighlight/30"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <circle
          className="text-surfaceHighlight/20"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="80"
          cy="80"
        />
        <circle
          className={`transition-all duration-1000 ease-out ${colorClass}`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="80"
          cy="80"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {statusText === 'SECURE' ? (
          <ShieldCheck className={`w-8 h-8 mb-1 ${colorClass}`} />
        ) : (
          <AlertTriangle className={`w-8 h-8 mb-1 ${colorClass} animate-pulse`} />
        )}
        <span className="text-[18px] font-bold text-white tracking-tight leading-none">{statusText}</span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-textSecondary mt-1.5 leading-none">Status</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInjecting, setIsInjecting] = useState(false);

  const fetchDashboard = async () => {
    try {
      setError(null);
      const res = await api.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const runSafe = async () => {
    try {
      setIsInjecting(true);
      await api.runSafeDemo();
      await fetchDashboard();
    } catch (err) {
      setError('Failed to run safe demo.');
    } finally {
      setIsInjecting(false);
    }
  };

  const runSuspicious = async () => {
    try {
      setIsInjecting(true);
      await api.runSuspiciousDemo();
      await fetchDashboard();
    } catch (err) {
      setError('Failed to run suspicious demo.');
    } finally {
      setIsInjecting(false);
    }
  };

  if (loading && !data) return <div className="text-textSecondary p-8 flex justify-center items-center h-screen font-mono text-base uppercase tracking-wider">Initializing Security Console...</div>;
  if (error) return <div className="text-block p-8 flex justify-center items-center h-full font-mono text-base">{error}</div>;

  const selectedEvent = data?.recentActivity?.[0];
  const hasThreats = selectedEvent?.recommendation === 'BLOCK';
  const safetyPercentage = selectedEvent 
    ? Math.max(0, 100 - (selectedEvent.riskScore || (hasThreats ? 75 : 12))) 
    : 100;
  const safetyColor = hasThreats ? 'text-block' : 'text-allow';

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-6 space-y-5 animate-in fade-in duration-700 pb-12">
      
      {/* Security Simulation Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-surface/50 border border-borderSubtle p-4 rounded-lg gap-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-textSecondary shrink-0" />
          <div>
            <div className="text-[13px] font-bold text-textPrimary uppercase tracking-wide">Test Firewall</div>
            <div className="text-[11px] text-textSecondary mt-0.5">Simulate a permission request</div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={runSafe} 
            disabled={isInjecting}
            className="flex-1 md:flex-none text-[11px] font-bold px-4 md:px-6 py-2.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors text-white uppercase tracking-widest disabled:opacity-50 text-center"
          >
            [ Safe Test ]
          </button>
          <button 
            onClick={runSuspicious} 
            disabled={isInjecting}
            className="flex-1 md:flex-none text-[11px] font-bold px-4 md:px-6 py-2.5 bg-block/10 border border-block/30 rounded hover:bg-block/20 hover:border-block/50 text-block transition-colors uppercase tracking-widest disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.1)] text-center"
          >
            [ Threat Test ]
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-surface relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface pointer-events-none"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between w-full relative z-10">
          <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-[13px] uppercase tracking-widest text-textSecondary mb-2 font-bold flex items-center justify-center md:justify-start gap-2">
              <div className={`w-2 h-2 rounded-full ${hasThreats ? 'bg-block' : 'bg-allow'} animate-pulse`}></div>
              Device Security
            </h2>
            <div className="text-[16px] text-textSecondary mb-4">Security engine is actively monitoring your device.</div>
            
            <h1 className={`text-[42px] md:text-[56px] font-bold tracking-tight uppercase leading-none mb-6 ${hasThreats ? 'text-block' : 'text-white'}`}>
              {hasThreats ? 'Threat Detected' : 'Protected'}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
              <div>
                <div className="text-textSecondary uppercase tracking-widest mb-1.5 text-[10px] font-mono">Risk Level</div>
                <div className={`font-bold text-[18px] ${hasThreats ? 'text-block' : 'text-allow'}`}>{hasThreats ? 'HIGH' : 'LOW'}</div>
              </div>
              <div>
                <div className="text-textSecondary uppercase tracking-widest mb-1.5 text-[10px] font-mono">Last Scan</div>
                <div className="text-white text-[18px] font-medium">Just now</div>
              </div>
              <div>
                <div className="text-textSecondary uppercase tracking-widest mb-1.5 text-[10px] font-mono">Threats Blocked</div>
                <div className="text-white text-[18px] font-medium">{data.activeAlerts}</div>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-center pl-0 md:pl-16 w-full md:w-auto mt-8 md:mt-0">
            <RadialProgress percentage={safetyPercentage} colorClass={safetyColor} statusText={hasThreats ? 'AT RISK' : 'SECURE'} />
          </div>
        </div>
      </div>

      {/* System Signal Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-surface/50 border border-borderSubtle p-4 rounded-lg">
        <div className="flex items-center gap-4 px-4 sm:border-r border-borderSubtle/50 pb-4 sm:pb-0 border-b sm:border-b-0">
          <Cpu className="w-5 h-5 text-textSecondary opacity-70" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest">CPU</span>
              <span className="text-[10px] font-mono text-allow font-bold">MONITORING</span>
            </div>
            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
              <div className="bg-allow/50 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4 md:border-r border-borderSubtle/50 pb-4 md:pb-0 border-b md:border-b-0">
          <Network className="w-5 h-5 text-textSecondary opacity-70 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest">Network</span>
              <span className="text-[10px] font-mono text-allow font-bold">SECURE</span>
            </div>
            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
              <div className="bg-allow/50 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4 sm:border-r border-borderSubtle/50 pb-4 sm:pb-0 border-b sm:border-b-0">
          <Battery className="w-5 h-5 text-textSecondary opacity-70 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest">Battery</span>
              <span className="text-[10px] font-mono text-allow font-bold">NORMAL</span>
            </div>
            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
              <div className="bg-allow h-full w-[85%]"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4">
          <ShieldCheck className="w-5 h-5 text-textSecondary opacity-70 shrink-0" />
          <div className="flex-1">
             <div className="text-[10px] font-mono text-textSecondary uppercase tracking-widest mb-0.5">Protected Apps</div>
             <div className="text-[15px] font-bold text-white">{data?.totalApps || 0} Active</div>
          </div>
        </div>
      </div>

      {/* Main Security Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Live Protection Timeline */}
        <div className="flex flex-col h-[400px] md:h-[460px] w-full">
          <h3 className="text-[14px] uppercase tracking-wider text-textPrimary font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-textSecondary shrink-0" /> Live Protection
          </h3>
          
          <div className="bg-surface border border-borderSubtle rounded-lg flex-1 overflow-y-auto relative p-4 md:p-5 custom-scrollbar">
            {data?.recentActivity?.length > 0 && (
              <div className="absolute left-[39px] top-8 bottom-6 w-[2px] bg-borderSubtle/30"></div>
            )}
            
            {data?.recentActivity?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShieldCheck className="w-12 h-12 text-surfaceHighlight mb-4" />
                <div className="text-[16px] text-textPrimary uppercase tracking-wider font-bold mb-2">No Active Threats</div>
                <div className="text-[14px] text-textSecondary max-w-sm mb-6">Security engine is monitoring your device.</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-allow"></div>
                  <span className="text-[11px] font-mono text-allow font-bold uppercase tracking-widest">Security Engine Active</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {data?.recentActivity?.map((req, i) => {
                const isBlock = req.recommendation === 'BLOCK';
                const isAsk = req.recommendation === 'ASK';
                const statusColor = isBlock ? 'text-block' : isAsk ? 'text-ask' : 'text-allow';
                const Icon = isBlock ? XCircle : isAsk ? Info : CheckCircle2;
                const isLatest = i === 0;

                return (
                  <div key={req._id} className="relative flex gap-5 z-10 group animate-in slide-in-from-bottom-4 duration-500">
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-background border-[2px] ${isBlock ? 'border-block/50' : isAsk ? 'border-ask/50' : 'border-allow/50'}`}>
                       <Icon className={`w-5 h-5 ${statusColor}`} />
                    </div>
                    
                    <div className="flex-1 pt-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-[16px] text-textPrimary flex items-center gap-2">
                          {req.appName}
                          {isLatest && (
                            <span className="text-[9px] font-mono font-bold bg-white text-black px-1.5 py-0.5 rounded uppercase tracking-widest">Latest</span>
                          )}
                          <span className="text-[10px] font-mono text-textSecondary opacity-60 bg-background px-1.5 py-0.5 rounded ml-1">
                            {new Date(req.timestamp).toLocaleTimeString([], { hour12: false })}
                          </span>
                        </div>
                        <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${statusColor}`}>
                          {req.recommendation}
                        </div>
                      </div>
                      
                      <div className="text-[14px] text-textSecondary">
                        <span className="uppercase text-[11px] font-mono tracking-widest opacity-60 mr-1.5">Event</span>
                        <span className="text-white">{req.permission} REQUEST</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Permission Intelligence */}
        <div className="flex flex-col h-[400px] md:h-[460px] w-full">
          <h3 className="text-[14px] uppercase tracking-wider text-textPrimary font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#3b82f6] shrink-0" /> Permission Intelligence
          </h3>
          
          <div className="bg-surface border border-borderSubtle rounded-lg flex-1 p-4 md:p-5 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent"></div>
            
            {!selectedEvent ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Target className="w-12 h-12 text-surfaceHighlight mb-4" />
                <div className="text-[16px] text-textPrimary uppercase tracking-wider font-bold mb-2">Waiting for request</div>
                <div className="text-[14px] text-textSecondary max-w-sm">Run a security test or analyze a permission to see the firewall reasoning.</div>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-background border border-borderSubtle rounded-lg flex justify-center items-center font-bold text-xl text-textSecondary">
                    {selectedEvent.appName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-textPrimary tracking-tight">{selectedEvent.appName}</div>
                    <div className="text-[11px] font-mono text-textSecondary uppercase tracking-widest mt-1">
                      Requesting <span className="text-[#3b82f6] font-bold bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">{selectedEvent.permission}</span>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-[11px] font-bold text-textPrimary uppercase tracking-wider mb-3 opacity-80">
                  {selectedEvent.recommendation === 'ALLOW' ? 'Why is this request safe?' : 'Why is this request suspicious?'}
                </h4>
                
                <div className="space-y-2 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {selectedEvent.reasons && selectedEvent.reasons.length > 0 ? (
                    selectedEvent.reasons.map((reason, i) => {
                      let category = "BEHAVIOR";
                      if (reason.toLowerCase().includes("context") || reason.toLowerCase().includes("calculating") || reason.toLowerCase().includes("mismatch")) category = "CONTEXT";
                      if (reason.toLowerCase().includes("history") || reason.toLowerCase().includes("never used") || reason.toLowerCase().includes("baseline")) category = "HISTORY";
                      if (reason.toLowerCase().includes("cpu") || reason.toLowerCase().includes("network") || reason.toLowerCase().includes("device") || reason.toLowerCase().includes("battery")) category = "DEVICE";
                      
                      const isAnomaly = selectedEvent.recommendation !== 'ALLOW';
                      
                      return (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-background/50 border border-borderSubtle rounded-lg">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest mb-1.5">{category}</span>
                            <span className="text-[14px] text-white/90">{reason}</span>
                          </div>
                          {isAnomaly ? (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-block font-bold bg-block/10 px-2.5 py-1 rounded">ANOMALY</span>
                          ) : (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-allow font-bold bg-allow/10 px-2.5 py-1 rounded">NORMAL</span>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-between p-3.5 bg-background/50 border border-borderSubtle rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-textSecondary uppercase tracking-widest mb-1.5">BASELINE</span>
                          <span className="text-[14px] text-white/90">Standard operating behavior</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-allow font-bold bg-allow/10 px-2.5 py-1 rounded">NORMAL</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-borderSubtle/50 mt-auto">
                  <div className="flex-1 p-3 md:p-4 bg-background border border-borderSubtle rounded-lg flex flex-col items-center justify-center">
                    <div className="text-[10px] font-mono text-textSecondary uppercase tracking-widest mb-1.5">Risk Score</div>
                    <div className={`text-[28px] md:text-[32px] font-bold font-mono leading-none ${selectedEvent.recommendation === 'BLOCK' ? 'text-block' : selectedEvent.recommendation === 'ASK' ? 'text-ask' : 'text-allow'}`}>
                      {selectedEvent.riskScore || (selectedEvent.recommendation === 'BLOCK' ? 75 : selectedEvent.recommendation === 'ASK' ? 45 : 12)}
                    </div>
                  </div>
                  <div className={`flex-1 p-3 md:p-4 rounded-lg border flex flex-col items-center justify-center ${selectedEvent.recommendation === 'BLOCK' ? 'bg-block/10 border-block/30' : selectedEvent.recommendation === 'ASK' ? 'bg-ask/10 border-ask/30' : 'bg-allow/10 border-allow/30'}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-widest mb-1.5 ${selectedEvent.recommendation === 'BLOCK' ? 'text-block' : selectedEvent.recommendation === 'ASK' ? 'text-ask' : 'text-allow'}`}>
                      Decision
                    </div>
                    <div className={`text-[20px] md:text-[24px] font-bold uppercase tracking-tight ${selectedEvent.recommendation === 'BLOCK' ? 'text-block' : selectedEvent.recommendation === 'ASK' ? 'text-ask' : 'text-allow'}`}>
                      {selectedEvent.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Area: Trust, Insight, Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        {/* App Trust Network */}
        <div className="bg-surface border border-borderSubtle rounded-lg flex flex-col">
          <div className="px-6 py-5 border-b border-borderSubtle">
            <h3 className="text-[14px] uppercase tracking-wider text-textPrimary font-bold">App Trust Network</h3>
          </div>
          <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
            {data?.apps?.map(app => (
              <div key={app.name} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-background border border-borderSubtle flex items-center justify-center font-bold text-[16px] text-textSecondary group-hover:text-white transition-colors">{app.name.charAt(0)}</div>
                  <div>
                    <div className="text-[15px] font-bold text-textPrimary">{app.name}</div>
                    <div className="text-[10px] font-mono text-textSecondary uppercase tracking-widest mt-0.5">{app.category || 'APP'}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full bg-allow`}></div>
                  <span className={`text-[9px] font-mono uppercase tracking-widest font-bold text-allow`}>MONITORED</span>
                </div>
              </div>
            ))}
            {(!data?.apps || data.apps.length === 0) && (
               <div className="text-center text-textSecondary text-[12px] font-mono p-4">NO APPS REGISTERED</div>
            )}
          </div>
        </div>

        {/* Security Intelligence Flow */}
        <div className="bg-surface border border-borderSubtle rounded-lg p-6 flex flex-col">
          <h3 className="text-[14px] uppercase tracking-wider text-textPrimary font-bold mb-4">Security Intelligence</h3>
          <p className="text-[14px] text-textSecondary mb-8 leading-relaxed">
            The deterministic security engine evaluates permission context, application history and device behavior before making a security decision.
          </p>
          <div className="flex flex-col gap-1.5 relative flex-1 justify-center pl-4">
            <div className="flex items-center gap-4"><span className="w-5 h-5 rounded-full bg-background border border-borderSubtle flex items-center justify-center text-[9px] text-textSecondary font-mono">1</span><span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#3b82f6]">Permission Request</span></div>
            <div className="ml-2.5 w-px h-3 bg-borderSubtle"></div>
            <div className="flex items-center gap-4"><span className="w-5 h-5 rounded-full bg-background border border-borderSubtle flex items-center justify-center text-[9px] text-textSecondary font-mono">2</span><span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#3b82f6]">Context Analysis</span></div>
            <div className="ml-2.5 w-px h-3 bg-borderSubtle"></div>
            <div className="flex items-center gap-4"><span className="w-5 h-5 rounded-full bg-background border border-borderSubtle flex items-center justify-center text-[9px] text-textSecondary font-mono">3</span><span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#3b82f6]">Behavior History</span></div>
            <div className="ml-2.5 w-px h-3 bg-borderSubtle"></div>
            <div className="flex items-center gap-4"><span className="w-5 h-5 rounded-full bg-background border border-borderSubtle flex items-center justify-center text-[9px] text-textSecondary font-mono">4</span><span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#3b82f6]">Device Telemetry</span></div>
            <div className="ml-2.5 w-px h-3 bg-borderSubtle"></div>
            <div className="flex items-center gap-4"><span className="w-5 h-5 rounded-full bg-block/10 border border-block/30 flex items-center justify-center text-[9px] text-block font-mono">5</span><span className="text-[11px] font-mono uppercase tracking-widest font-bold text-block">Risk Decision</span></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-borderSubtle rounded-lg p-5 flex flex-col justify-center gap-3">
          <Link to="/analysis" className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-borderSubtle transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-background border border-borderSubtle flex items-center justify-center text-textSecondary group-hover:text-white group-hover:border-white/20 transition-all shadow-sm"><Crosshair className="w-5 h-5"/></div>
            <div>
              <div className="text-[14px] font-bold text-textPrimary uppercase tracking-wide">Analyze Permission</div>
              <div className="text-[12px] text-textSecondary mt-1">Run manual analysis on a request</div>
            </div>
          </Link>
          <Link to="/blackbox" className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-borderSubtle transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-background border border-borderSubtle flex items-center justify-center text-textSecondary group-hover:text-white group-hover:border-white/20 transition-all shadow-sm"><ServerCrash className="w-5 h-5"/></div>
            <div>
              <div className="text-[14px] font-bold text-textPrimary uppercase tracking-wide">Open Black Box</div>
              <div className="text-[12px] text-textSecondary mt-1">View immutable security logs</div>
            </div>
          </Link>
          <Link to="/behavior" className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-borderSubtle transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-background border border-borderSubtle flex items-center justify-center text-textSecondary group-hover:text-white group-hover:border-white/20 transition-all shadow-sm"><Activity className="w-5 h-5"/></div>
            <div>
              <div className="text-[14px] font-bold text-textPrimary uppercase tracking-wide">Check Behavior</div>
              <div className="text-[12px] text-textSecondary mt-1">View application baseline metrics</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
