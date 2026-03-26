/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, Download, Play, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeRange {
  start: string;
  end: string;
}

const DEFAULT_RANGES: TimeRange[] = [
  { start: '07:00', end: '08:30' },
  { start: '11:30', end: '12:30' },
  { start: '17:30', end: '19:00' },
  { start: '20:30', end: '22:00' },
];

export default function App() {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalLines, setTotalLines] = useState<number>(10);
  const [postsPerDay, setPostsPerDay] = useState<number>(3);
  const [customRanges, setCustomRanges] = useState<TimeRange[]>(DEFAULT_RANGES);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    return h * 60 + m;
  };

  const resetRanges = () => {
    setCustomRanges([...DEFAULT_RANGES]);
  };

  const generateTimestamps = () => {
    const generated: string[] = [];
    const [year, month, day] = startDate.split('-').map(Number);
    let currentDay = new Date(year, month - 1, day);
    let count = 0;
    let globalRangeIndex = 0; // Track range across days for even distribution

    while (count < totalLines) {
      for (let i = 0; i < postsPerDay && count < totalLines; i++) {
        const range = customRanges[globalRangeIndex % customRanges.length];
        const startMin = timeToMinutes(range.start);
        const endMin = timeToMinutes(range.end);
        
        const randomTotalMinutes = Math.floor(Math.random() * (endMin - startMin)) + startMin;
        
        const h = Math.floor(randomTotalMinutes / 60);
        const m = randomTotalMinutes % 60;
        const s = Math.floor(Math.random() * 60);

        const yyyy = currentDay.getFullYear();
        const mm = String(currentDay.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDay.getDate()).padStart(2, '0');
        const hh = String(h).padStart(2, '0');
        const min = String(m).padStart(2, '0');
        const sec = String(s).padStart(2, '0');

        const formatted = `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}`;
        generated.push(formatted);
        count++;
        globalRangeIndex++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    setResults(generated);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([results.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `timestamps_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Main App Window Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl h-[92vh] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden flex flex-col"
      >
        {/* App Header */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Clock size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900 uppercase tracking-tight leading-none">Timestamp Generator</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Professional Scheduling Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">System Ready</span>
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Controls */}
          <aside className="w-80 bg-[#f8f9fa] border-r border-gray-200 p-8 flex flex-col gap-8 shrink-0">
            <div className="space-y-1">
              <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Configuration</h2>
              <p className="text-xs text-gray-400">Tùy chỉnh thông số tạo lập</p>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-350px)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ngày bắt đầu</label>
                  <Calendar size={12} className="text-gray-300" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tổng số dòng</label>
                  <Clock size={12} className="text-gray-300" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={totalLines}
                  onChange={(e) => setTotalLines(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lượt đăng / ngày</label>
                  <Play size={12} className="text-gray-300" />
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setPostsPerDay(n)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        postsPerDay === n 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Khung giờ đăng</label>
                  <button 
                    onClick={resetRanges}
                    className="text-[9px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    RESET
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 italic -mt-1">Gợi ý: 07:00 - 08:30, 11:30 - 12:30...</p>
                <div className="space-y-2">
                  {customRanges.map((range, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          value={range.start}
                          onChange={(e) => {
                            const newRanges = [...customRanges];
                            newRanges[idx].start = e.target.value;
                            setCustomRanges(newRanges);
                          }}
                          className="px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="time"
                          value={range.end}
                          onChange={(e) => {
                            const newRanges = [...customRanges];
                            newRanges[idx].end = e.target.value;
                            setCustomRanges(newRanges);
                          }}
                          className="px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateTimestamps}
              className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
            >
              <Play size={16} fill="currentColor" className="group-hover:translate-x-0.5 transition-transform" />
              GENERATE DATA
            </button>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">Summary</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">Ranges Active</span>
                  <span className="text-[10px] font-bold text-blue-600">{customRanges.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">Distribution</span>
                  <span className="text-[10px] font-bold text-green-600">Even Cycle</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Results Table */}
          <main className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 shrink-0 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Output Stream</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Dữ liệu thời gian đã được định dạng</p>
                </div>
                {results.length > 0 && (
                  <div className="h-4 w-[1px] bg-gray-200"></div>
                )}
                {results.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {results.length} ROWS
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {results.length > 0 && (
                  <>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-gray-200"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copied ? 'COPIED' : 'COPY ALL'}
                    </button>
                    <button
                      onClick={downloadTxtFile}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold bg-gray-900 text-white hover:bg-black rounded-lg transition-all shadow-lg shadow-black/10"
                    >
                      <Download size={14} />
                      EXPORT TXT
                    </button>
                    <div className="w-[1px] h-6 bg-gray-100 mx-1"></div>
                    <button
                      onClick={() => setResults([])}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto custom-scrollbar bg-[#fafafa]">
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  <motion.table 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full text-left border-separate border-spacing-0"
                  >
                    <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10">
                      <tr>
                        <th className="px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">#</th>
                        <th className="px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">ISO Timestamp</th>
                        <th className="px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {results.map((res, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-10 py-4 text-[11px] font-mono text-gray-300">{String(idx + 1).padStart(3, '0')}</td>
                          <td className="px-10 py-4 text-[12px] font-mono font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            {res}
                          </td>
                          <td className="px-10 py-4 text-right">
                            <button 
                              onClick={() => navigator.clipboard.writeText(res)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                              title="Copy row"
                            >
                              <Copy size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-6 p-20 text-center">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm">
                        <Clock size={40} className="text-gray-100" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Ready for Generation</p>
                      <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed">
                        Thiết lập cấu hình ở thanh bên trái và nhấn Generate để bắt đầu tạo dữ liệu.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Bar */}
            <div className="h-7 bg-[#f1f3f5] border-t border-gray-200 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  Service Online
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  Local Engine
                </span>
              </div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Build 2026.03.26 • Production
              </div>
            </div>
          </main>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
