import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity, AlertTriangle, ShieldCheck, TerminalSquare, Database } from 'lucide-react';

export default function Behavior() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getApps()
      .then(res => {
        setApps(res.data);
        if (res.data.length > 0) setSelectedApp(res.data[0]);
      })
      .catch(err => setError('Failed to load apps.'));
  }, []);

  useEffect(() => {
    if (selectedApp) {
      api.getEvents(selectedApp._id)
        .then(res => setEvents(res.data))
        .catch(err => setError('Failed to load events.'));
    }
  }, [selectedApp]);

  const hasHighBackground = events.some(e => e.eventType === 'APP_BACKGROUND' && (e.severity === 'HIGH' || e.severity === 'MEDIUM'));
  const hasHighNetwork = events.some(e => e.eventType === 'NETWORK_INCREASE');
  const hasRequestedMic = events.some(e => e.eventType === 'PERMISSION_REQUESTED' && e.value === 'MICROPHONE');
  const hasRequestedContacts = events.some(e => e.eventType === 'PERMISSION_REQUESTED' && e.value === 'CONTACTS');

  const isAnomalous = hasHighBackground || hasHighNetwork || hasRequestedMic;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b border-borderSubtle pb-4">
        <Activity className="text-textSecondary w-6 h-6" />
        <div>
          <h1 className="text-xl font-mono font-bold text-textPrimary tracking-tight uppercase">Behavioral Anomaly Monitor</h1>
          <p className="text-xs text-textSecondary font-mono uppercase tracking-wider">Baseline VS Evidence</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-block/10 border border-block/20 text-block text-sm font-mono rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden flex flex-col h-[500px]">
          <div className="p-3 bg-background border-b border-borderSubtle flex items-center gap-2">
            <Database className="w-4 h-4 text-textSecondary" />
            <h2 className="text-[10px] font-mono font-bold text-textPrimary uppercase tracking-wider">Target App</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {apps.map(app => (
              <button
                key={app._id}
                onClick={() => setSelectedApp(app)}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                  selectedApp?._id === app._id 
                    ? 'bg-surfaceHighlight text-textPrimary font-bold' 
                    : 'text-textSecondary hover:bg-surfaceHighlight/50 hover:text-textPrimary'
                }`}
              >
                {app.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedApp ? (
            <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden">
              <div className="grid grid-cols-2 bg-background border-b border-borderSubtle text-[10px] font-mono font-bold text-textSecondary uppercase tracking-wider">
                <div className="p-3 border-r border-borderSubtle text-center">Established Baseline</div>
                <div className="p-3 text-center">Current Evidence</div>
              </div>
              
              <div className="divide-y divide-borderSubtle">
                <div className="grid grid-cols-2 transition-colors hover:bg-surfaceHighlight/30">
                  <div className="p-4 border-r border-borderSubtle flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Microphone Usage</div>
                    <div className="text-sm font-mono text-textPrimary">{selectedApp.permissionUsage.MICROPHONE > 0 ? 'ESTABLISHED' : 'NEVER USED'}</div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Microphone Usage</div>
                    {hasRequestedMic && selectedApp.permissionUsage.MICROPHONE === 0 ? (
                      <div className="text-sm font-mono text-block font-bold flex items-center gap-2 animate-pulse">REQUESTED <AlertTriangle className="w-4 h-4" /></div>
                    ) : (
                      <div className="text-sm font-mono text-allow">NORMAL</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 transition-colors hover:bg-surfaceHighlight/30">
                  <div className="p-4 border-r border-borderSubtle flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Contacts Access</div>
                    <div className="text-sm font-mono text-textPrimary">{selectedApp.permissionUsage.CONTACTS > 0 ? 'ESTABLISHED' : 'NEVER USED'}</div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Contacts Access</div>
                    {hasRequestedContacts && selectedApp.permissionUsage.CONTACTS === 0 ? (
                      <div className="text-sm font-mono text-block font-bold flex items-center gap-2 animate-pulse">REQUESTED <AlertTriangle className="w-4 h-4" /></div>
                    ) : (
                      <div className="text-sm font-mono text-allow">NORMAL</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 transition-colors hover:bg-surfaceHighlight/30">
                  <div className="p-4 border-r border-borderSubtle flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Background Activity</div>
                    <div className="text-sm font-mono text-textPrimary">{selectedApp.baselineBehavior.backgroundActivity}</div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Background Activity</div>
                    {hasHighBackground && selectedApp.baselineBehavior.backgroundActivity === 'LOW' ? (
                      <div className="text-sm font-mono text-block font-bold flex items-center gap-2">HIGH <AlertTriangle className="w-4 h-4" /></div>
                    ) : (
                      <div className="text-sm font-mono text-allow">{selectedApp.baselineBehavior.backgroundActivity}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 transition-colors hover:bg-surfaceHighlight/30">
                  <div className="p-4 border-r border-borderSubtle flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Network Activity</div>
                    <div className="text-sm font-mono text-textPrimary">{selectedApp.baselineBehavior.networkActivity}</div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-xs font-mono text-textSecondary uppercase tracking-wider">Network Activity</div>
                    {hasHighNetwork && selectedApp.baselineBehavior.networkActivity === 'LOW' ? (
                      <div className="text-sm font-mono text-block font-bold flex items-center gap-2">HIGH <AlertTriangle className="w-4 h-4" /></div>
                    ) : (
                      <div className="text-sm font-mono text-allow">{selectedApp.baselineBehavior.networkActivity}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-borderSubtle">
                {isAnomalous ? (
                  <div className="p-6 bg-block/5">
                    <div className="flex items-center gap-3 text-block mb-3">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                      <h3 className="font-mono font-bold uppercase tracking-wider">Behavioral Change Detected</h3>
                    </div>
                    <div className="bg-background/80 border border-block/20 p-4 rounded font-mono text-xs text-textSecondary leading-relaxed">
                      <div className="flex items-start gap-2 mb-2">
                        <TerminalSquare className="w-4 h-4 text-block mt-0.5" />
                        <span className="text-block">ANALYSIS: </span>
                        This application's current behavior significantly deviates from its established historical baseline. The combined evidence indicates a potential threat pattern.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-allow/5">
                    <div className="flex items-center gap-3 text-allow mb-3">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="font-mono font-bold uppercase tracking-wider">Normal Behavior Pattern</h3>
                    </div>
                    <div className="bg-background/80 border border-allow/20 p-4 rounded font-mono text-xs text-textSecondary leading-relaxed">
                      <div className="flex items-start gap-2">
                        <TerminalSquare className="w-4 h-4 text-allow mt-0.5" />
                        <span className="text-allow">ANALYSIS: </span>
                        Application behavior remains consistent with established historical baselines. No anomalous activity detected in recent telemetry.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-borderSubtle h-full flex items-center justify-center p-10 text-center text-textSecondary font-mono text-sm uppercase tracking-wider">
              Select a target to initialize comparison
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
