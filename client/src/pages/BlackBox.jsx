import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ServerCrash, Activity, Filter, Clock } from 'lucide-react';

export default function BlackBox() {
  const [events, setEvents] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getApps()
      .then(res => setApps(res.data))
      .catch(err => setError('Failed to load apps.'));
  }, []);

  useEffect(() => {
    api.getEvents(selectedApp)
      .then(res => {
        let data = res.data;
        if (filterType === 'HIGH') data = data.filter(e => e.severity === 'HIGH' || e.severity === 'CRITICAL');
        if (filterType === 'CRITICAL') data = data.filter(e => e.severity === 'CRITICAL');
        if (filterType === 'CPU') data = data.filter(e => e.eventType.includes('CPU'));
        if (filterType === 'NETWORK') data = data.filter(e => e.eventType.includes('NETWORK'));
        if (filterType === 'BATTERY') data = data.filter(e => e.eventType.includes('BATTERY'));
        if (filterType === 'PERMISSIONS') data = data.filter(e => e.eventType.includes('PERMISSION'));
        
        setEvents(data);
      })
      .catch(err => setError('Failed to load events.'));
  }, [selectedApp, filterType]);

  const FILTERS = ['ALL', 'HIGH', 'CRITICAL', 'CPU', 'NETWORK', 'BATTERY', 'PERMISSIONS'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
        <div className="flex items-center gap-3">
          <ServerCrash className="text-textSecondary w-6 h-6" />
          <div>
            <h1 className="text-xl font-mono font-bold text-textPrimary tracking-tight uppercase">Phone Black Box</h1>
            <p className="text-xs text-textSecondary font-mono uppercase tracking-wider">Device Telemetry Recorder</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-allow animate-pulse" />
          <span className="text-[10px] text-allow font-mono uppercase tracking-wider">Recording Active</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-block/10 border border-block/20 text-block text-sm font-mono rounded">
          {error}
        </div>
      )}

      <div className="bg-surface border border-borderSubtle rounded-lg p-4 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Filter className="w-4 h-4 text-textSecondary" />
          <select 
            value={selectedApp} 
            onChange={e => setSelectedApp(e.target.value)}
            className="bg-background border border-borderSubtle text-textPrimary rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-textSecondary transition-colors min-w-[150px]"
          >
            <option value="">ALL APPLICATIONS</option>
            {apps.map(a => <option key={a._id} value={a._id}>{a.name.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`text-[10px] font-mono px-3 py-1 border rounded uppercase tracking-wider transition-colors ${
                filterType === f 
                  ? 'bg-textPrimary text-background border-textPrimary font-bold' 
                  : 'bg-background text-textSecondary border-borderSubtle hover:border-textSecondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-borderSubtle overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-borderSubtle bg-background/50 text-[10px] text-textSecondary font-mono uppercase tracking-wider">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-3">Target App</div>
          <div className="col-span-4">Event Signature</div>
          <div className="col-span-2">Value</div>
          <div className="col-span-1 text-right">Severity</div>
        </div>

        {/* Telemetry Stream */}
        <div className="divide-y divide-borderSubtle/50">
          {events.length === 0 && (
            <div className="p-8 text-center text-textSecondary font-mono text-sm">No telemetry records match the current filter.</div>
          )}
          {events.map((event) => {
            const isHigh = event.severity === 'HIGH';
            const isCritical = event.severity === 'CRITICAL';
            const colorClass = isCritical ? 'text-block border-block/20 bg-block/5' : isHigh ? 'text-ask border-ask/20 bg-ask/5' : 'text-allow border-allow/20 bg-allow/5';
            const textClass = isCritical ? 'text-block' : isHigh ? 'text-ask' : 'text-allow';

            return (
              <div key={event._id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-surfaceHighlight/50`}>
                <div className="col-span-2 flex items-center gap-2">
                  <Clock className={`w-3 h-3 ${textClass}`} />
                  <span className="font-mono text-xs text-textSecondary">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}
                  </span>
                </div>
                <div className="col-span-3 font-mono text-sm text-textPrimary font-bold">
                  {event.appName}
                </div>
                <div className="col-span-4 font-mono text-xs text-textSecondary">
                  <span className="bg-background px-2 py-1 rounded border border-borderSubtle">{event.eventType}</span>
                </div>
                <div className="col-span-2 font-mono text-xs text-textPrimary">
                  {event.value || '-'}
                </div>
                <div className="col-span-1 text-right flex justify-end">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
                    {event.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
