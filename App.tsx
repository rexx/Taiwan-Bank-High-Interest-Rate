
import React, { useState, useMemo, useEffect } from 'react';
import { BANKS } from './data/banks';
import { BankData, BankRateInfo } from './types';
import { Check, Info, Wallet, UserCheck, CreditCard, ExternalLink, Settings2, X, Banknote, Calculator, TrendingUp, Moon, Sun, UserPlus, ShieldCheck, Ban, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'taiwan-bank-owned-ids';
const SETUP_COMPLETED_KEY = 'taiwan-bank-setup-completed';
const THEME_KEY = 'taiwan-bank-theme';
const INCLUDE_NEW_KEY = 'taiwan-bank-include-new';
const VIEW_MODE_KEY = 'taiwan-bank-view-mode';

const DEFAULT_BANK_CODES = ['812', '017', '807', '048', '004']; // 台新, 兆豐, 永豐, 王道, 台銀
const DEFAULT_CASH = 1000000;

const App: React.FC = () => {
  const [ownedBankCodes, setOwnedBankCodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set(DEFAULT_BANK_CODES);
      }
    }
    return new Set(DEFAULT_BANK_CODES);
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [includeNewAccounts, setIncludeNewAccounts] = useState<boolean>(() => {
    const saved = localStorage.getItem(INCLUDE_NEW_KEY);
    return saved !== 'false';
  });

  const [viewMode, setViewMode] = useState<'card' | 'compact'>(() => {
    return (localStorage.getItem(VIEW_MODE_KEY) as 'card' | 'compact') || 'card';
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [totalCash, setTotalCash] = useState<number>(DEFAULT_CASH);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(ownedBankCodes)));
  }, [ownedBankCodes]);

  useEffect(() => {
    localStorage.setItem(INCLUDE_NEW_KEY, includeNewAccounts.toString());
  }, [includeNewAccounts]);

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const isSetupCompleted = localStorage.getItem(SETUP_COMPLETED_KEY);
    if (!isSetupCompleted) {
      setIsSettingsOpen(true);
    }
  }, []);

  const closeSettings = () => {
    setIsSettingsOpen(false);
    localStorage.setItem(SETUP_COMPLETED_KEY, 'true');
  };

  const toggleBankByCode = (code: string) => {
    const newSet = new Set(ownedBankCodes);
    if (newSet.has(code)) {
      newSet.delete(code);
    } else {
      newSet.add(code);
    }
    setOwnedBankCodes(newSet);
  };

  const toggleExpandRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const sortedBanks = useMemo(() => {
    return [...BANKS]
      .sort((a, b) => {
        const aIsOwned = ownedBankCodes.has(a.code);
        const bIsOwned = ownedBankCodes.has(b.code);
        
        if (!includeNewAccounts) {
          if (aIsOwned && !bIsOwned) return -1;
          if (!aIsOwned && bIsOwned) return 1;
        }

        const aRate = aIsOwned ? a.oldCustomer.rate : a.newCustomer.rate;
        const bRate = bIsOwned ? b.oldCustomer.rate : b.newCustomer.rate;
        
        return bRate - aRate;
      });
  }, [ownedBankCodes, includeNewAccounts]);

  const allocation = useMemo(() => {
    let remaining = totalCash;
    const result: Record<string, number> = {};
    let totalInterest = 0;

    const eligibleBanks = includeNewAccounts 
      ? sortedBanks 
      : sortedBanks.filter(bank => ownedBankCodes.has(bank.code));

    for (const bank of eligibleBanks) {
      const isOwned = ownedBankCodes.has(bank.code);
      const data = isOwned ? bank.oldCustomer : bank.newCustomer;
      
      if (remaining <= 0) {
        result[bank.id] = 0;
        continue;
      }

      const deposit = Math.min(remaining, data.numericQuota);
      result[bank.id] = deposit;
      totalInterest += deposit * (data.rate / 100);
      remaining -= deposit;
    }

    return { result, totalInterest, remaining };
  }, [totalCash, sortedBanks, ownedBankCodes, includeNewAccounts]);

  const uniqueBanksForSettings = useMemo(() => {
    const seen = new Set();
    return BANKS.filter(bank => {
      const duplicate = seen.has(bank.code);
      seen.add(bank.code);
      return !duplicate;
    }).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-indigo-900 dark:to-slate-900 text-white py-6 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold leading-tight">台灣高利活存 (2026)</h1>
              <p className="text-[10px] md:text-sm text-blue-100 opacity-80">極大化您的利息收益</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white flex items-center justify-center">
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 dark:bg-indigo-600 dark:text-white rounded-full font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-all shadow-sm active:scale-95">
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">帳戶設定</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 space-y-6 transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                輸入存款現金 (萬元)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">$</span>
                <input 
                  type="number"
                  placeholder="例如: 100"
                  className="w-full pl-8 pr-16 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xl font-bold focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all"
                  value={totalCash / 10000 || ''}
                  onChange={(e) => setTotalCash(Number(e.target.value) * 10000)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">萬元</span>
              </div>
            </div>
            <div className="w-full md:w-auto grid grid-cols-2 md:flex gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl flex-1 md:min-w-[160px] border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block mb-1">預估年利息</span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{formatCurrency(allocation.totalInterest)}</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl flex-1 md:min-w-[160px] border border-blue-100 dark:border-blue-900/50">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase block mb-1">平均年利率</span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                  {totalCash > 0 ? ((allocation.totalInterest / totalCash) * 100).toFixed(3) : '0.000'}%
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${includeNewAccounts ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                   {includeNewAccounts ? <UserPlus className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {includeNewAccounts ? '積極配置：包含新開戶建議' : '穩健配置：僅限現有帳戶'}
                   </p>
                   <p className="text-xs text-slate-400 dark:text-slate-500">
                      {includeNewAccounts ? '優先配置於市場最高利率' : '僅計算您勾選擁有的帳戶'}
                   </p>
                </div>
             </div>
             <button 
                onClick={() => setIncludeNewAccounts(!includeNewAccounts)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-transparent ${includeNewAccounts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
             >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${includeNewAccounts ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            最佳存放配置
          </h2>
          <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              title="卡片模式"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              title="精簡模式"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'card' ? (
          <div className="space-y-3">
            {sortedBanks.map((bank) => {
              const isOwned = ownedBankCodes.has(bank.code);
              const data: BankRateInfo = isOwned ? bank.oldCustomer : bank.newCustomer;
              const depositAmount = allocation.result[bank.id] || 0;
              const isSelectedForDeposit = depositAmount > 0;
              const isExcludedByStrategy = !includeNewAccounts && !isOwned;

              return (
                <div 
                  key={bank.id}
                  className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 shadow-sm border-l-4 transition-all duration-300 ${
                    isExcludedByStrategy 
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 border-dashed' :
                    !isSelectedForDeposit 
                      ? 'border-slate-200 dark:border-slate-800 border-dotted' :
                    isOwned ? 'border-emerald-500 dark:border-emerald-600 shadow-indigo-100/50' : 'border-blue-500 dark:border-blue-600 shadow-indigo-100/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                          isOwned ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
                        }`}>
                          {isOwned ? '舊戶專屬' : '新戶推薦'}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">#{bank.code}</span>
                        {isSelectedForDeposit && (
                          <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">推薦存放</span>
                        )}
                      </div>
                      <h3 className={`text-base md:text-lg font-bold transition-colors ${isExcludedByStrategy ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>{bank.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-y-2 gap-x-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">單筆上限</span>
                          <span className={`text-xs md:text-sm font-semibold ${isExcludedByStrategy ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>{data.quota}</span>
                        </div>
                        {isSelectedForDeposit && (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-tighter">建議存入</span>
                            <span className="text-xs md:text-sm font-black text-indigo-700 dark:text-indigo-300">{formatCurrency(depositAmount)}</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">跨轉/跨提</span>
                          <span className={`text-xs md:text-sm font-semibold ${isExcludedByStrategy ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>{data.transfers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end justify-center min-w-[120px]">
                      <span className={`text-2xl md:text-3xl font-black tracking-tighter transition-colors ${
                        isExcludedByStrategy ? 'text-slate-300 dark:text-slate-800' :
                        !isSelectedForDeposit ? 'text-slate-400 dark:text-slate-600' :
                        isOwned ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>{data.display}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">預期年利率</span>
                    </div>
                  </div>
                  {data.notes && !isExcludedByStrategy && (
                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex gap-1.5 items-start">
                      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-300 dark:text-slate-600" />
                      <span className="leading-relaxed">{data.notes}</span>
                    </div>
                  )}
                  {isSelectedForDeposit && data.numericQuota !== Infinity && (
                    <div className="mt-4 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${isOwned ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-blue-500 dark:bg-blue-600'}`} style={{ width: `${(depositAmount / data.numericQuota) * 100}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 min-w-[160px]">銀行代碼 & 名稱</th>
                    <th className="px-4 py-3 text-right">預期利率</th>
                    <th className="px-4 py-3 text-right">建議存入</th>
                    <th className="px-4 py-3 text-right">額度上限</th>
                    <th className="px-2 py-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {sortedBanks.map((bank) => {
                    const isOwned = ownedBankCodes.has(bank.code);
                    const data: BankRateInfo = isOwned ? bank.oldCustomer : bank.newCustomer;
                    const depositAmount = allocation.result[bank.id] || 0;
                    const isSelectedForDeposit = depositAmount > 0;
                    const isExcludedByStrategy = !includeNewAccounts && !isOwned;
                    const isExpanded = expandedRows.has(bank.id);
                    const usagePercent = data.numericQuota !== Infinity ? (depositAmount / data.numericQuota) * 100 : 0;

                    return (
                      <React.Fragment key={bank.id}>
                        <tr 
                          onClick={() => toggleExpandRow(bank.id)}
                          className={`group cursor-pointer transition-colors relative hover:bg-slate-50/80 dark:hover:bg-slate-800/30 ${
                            isExcludedByStrategy ? 'opacity-40 grayscale' : 
                            isSelectedForDeposit ? 'bg-indigo-50/10 dark:bg-indigo-500/5' : ''
                          }`}
                        >
                          <td className="px-4 py-2.5 relative">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded flex-shrink-0">
                                {bank.code}
                              </span>
                              <div className="flex items-center gap-1.5 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOwned ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                <span className="text-slate-800 dark:text-slate-100 font-bold text-sm truncate">{bank.name}</span>
                              </div>
                            </div>
                            {/* Thin Progress Bar for Compact Mode */}
                            {isSelectedForDeposit && data.numericQuota !== Infinity && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${isOwned ? 'bg-emerald-500/60' : 'bg-blue-500/60'}`}
                                        style={{ width: `${usagePercent}%` }}
                                    ></div>
                                </div>
                            )}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-black text-sm whitespace-nowrap ${
                            isExcludedByStrategy ? 'text-slate-400' :
                            isOwned ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {data.display}
                          </td>
                          <td className="px-4 py-2.5 text-right whitespace-nowrap">
                            {isSelectedForDeposit ? (
                              <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{formatCurrency(depositAmount)}</span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right text-[11px] text-slate-500 font-medium whitespace-nowrap">{data.quota}</td>
                          <td className="px-2 py-2.5">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/30 dark:bg-slate-950/20">
                            <td colSpan={5} className="px-4 py-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs">
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{isOwned ? '已持有(舊戶)' : '新開戶建議'}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <Calculator className="w-3.5 h-3.5" />
                                    <span>跨轉/提：{data.transfers}</span>
                                  </div>
                                </div>
                                {data.notes && (
                                  <div className="p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <Info className="w-3 h-3 inline mr-1 text-slate-300" />
                                    {data.notes}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {allocation.remaining > 0 && (
          <div className="mt-8 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center transition-colors">
            <p className="text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              尚有 {formatCurrency(allocation.remaining)} 未能排入高利額度
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 italic">
               {includeNewAccounts ? '建議將剩餘資金放入基本牌告利率較高之帳戶' : '建議勾選更多現有帳戶獲得更高利息'}
            </p>
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={closeSettings}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  我有帳戶的銀行
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">勾選後將顯示為「舊戶」利率並重新排序。</p>
              </div>
              <button onClick={closeSettings} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              {uniqueBanksForSettings.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => toggleBankByCode(bank.code)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-200 group ${
                    ownedBankCodes.has(bank.code)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      ownedBankCodes.has(bank.code) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                    }`}>
                      {ownedBankCodes.has(bank.code) && <Check className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">{bank.code}</span>
                    <span className="font-semibold">{bank.name.replace(/\(級距.\)/, '').trim()}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">已選 <span className="text-indigo-600 dark:text-indigo-400 font-bold">{ownedBankCodes.size}</span> 間銀行</span>
              <div className="flex gap-3">
                <button onClick={() => setOwnedBankCodes(new Set())} className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors">清空</button>
                <button onClick={closeSettings} className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg">完成</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-slate-400 dark:text-slate-600 text-[10px] md:text-xs pb-10 space-y-2 px-4 transition-colors">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <a href="https://www.ptt.cc/bbs/Bank_Service/M.1767533701.A.974.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 dark:text-indigo-500 hover:text-indigo-600 transition-colors">
            資料來源：PTT Bank_Service <ExternalLink className="w-3 h-3" />
          </a>
          <span className="hidden sm:inline opacity-30">|</span>
          <p className="opacity-75">資料更新：2026年01月04日</p>
        </div>
        <p>© 2026 Taiwan Bank Rate Comparator</p>
        <p className="opacity-60 max-w-md mx-auto">本工具僅供參考，實際利率及詳細條件請以各銀行官網最新公告為準。</p>
      </footer>
    </div>
  );
};

export default App;
