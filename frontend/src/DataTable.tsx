import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface BackendStatus {
  status: string;
  totalCPU: number;
  totalDisk: number;
  totalRAM: number;
}

export default function DataTable() {
  const [data, setData] = useState<BackendStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsRefreshing(true);

        // If you set up a Vite proxy, prefer a relative URL like '/api/v1/healthcheck/bit'
        const res = await axios.get<BackendStatus>(
          'http://localhost:8080/api/v1/healthcheck/bit',
          {
            // cache-buster param to defeat browser/proxy caching
            params: { _: Date.now() },
            // headers: { 'Cache-Control': 'no-cache' },
          }
        );

        if (!isMounted) return;

        setData(res.data);
        setLastUpdated(Date.now());
      } catch (err) {
        console.error('Error fetching data:', err);
        if (!isMounted) return;

        // Optional: fallback so UI shows *something*
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    };

    // initial fetch
    fetchData();

    // poll every 15s
    timerRef.current = window.setInterval(fetchData, 15000);

    return () => {
      isMounted = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading system data...</p>
      </div>
    );
  }

  const metrics = [
    { label: 'Status', value: data.status, color: data.status === 'OK' ? 'text-green-600' : 'text-red-600' },
    { label: 'CPU Usage', value: `${data.totalCPU.toFixed(2)}%` },
    { label: 'Disk Usage', value: `${data.totalDisk.toFixed(2)}%` },
    { label: 'RAM Usage', value: `${data.totalRAM.toFixed(0)}%` },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">System Health</h1>
          <span className={`text-xs ${isRefreshing ? 'text-blue-600' : 'text-gray-400'}`}>
            {isRefreshing ? 'Refreshing…' : 'Idle'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-none">
              <span className="text-gray-500 font-medium">{m.label}</span>
              <span className={`text-lg font-semibold ${m.color || 'text-gray-700'}`}>{m.value}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}
        </p>
      </div>
    </div>
  );
}
