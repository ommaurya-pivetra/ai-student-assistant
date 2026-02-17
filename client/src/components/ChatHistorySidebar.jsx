import React, { useEffect, useRef, useState } from 'react';
import { getChatHistory, deleteChat, clearChatHistory } from '../services/api.service';

const ChatHistorySidebar = ({ onSelectChat, currentChatId, isOpen, user, refreshKey, onLogout }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Only load history when user is authenticated
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, refreshKey]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getChatHistory();
      setHistory(result.data.chats);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setHistory((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to delete all chats?')) {
      try {
        await clearChatHistory();
        setHistory([]);
        const handleSelectChatItem = (chatId) => {
          setAccountMenuOpen(false);
          onSelectChat(chatId);
        };
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };


  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric'});
  };

  const filteredHistory = history.filter((chat) =>
    chat.prompt?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const groupedHistory = filteredHistory.reduce((groups, chat) => {
    const label = formatDate(chat.createdAt);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(chat);
    return groups;
  }, {});

  const groupEntries = Object.entries(groupedHistory);

  const accountLabel = user?.username || user?.email || 'Account';
  const avatarText = accountLabel.trim().charAt(0).toUpperCase() || 'A';

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-2xl transition-all duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 z-40`}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-3 border-b border-slate-700 space-y-3">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search chats"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-xs text-slate-400">Loading...</p>}
          {error && <p className="text-xs text-rose-400">{error}</p>}

          {!loading && filteredHistory.length === 0 && (
            <p className="text-xs text-slate-400 text-center">No chats yet</p>
          )}

          <div className="space-y-1 px-1 mt-1">
            {groupEntries.map(([label, chats]) => (
              <div key={label} className="space-y-1">
                <div className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </div>
                {chats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => handleSelectChatItem(chat._id)}
                    className={`w-full text-left px-2 py-1 rounded-lg transition-all group ${
                      currentChatId === chat._id
                        ? 'bg-black text-white'
                        : ' hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center justify-between flex-row gap-1">
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {(chat.prompt || '').slice(0, 28)}{chat.prompt?.length > 28 ? '...' : ''}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 border-t border-slate-700">
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-left text-xs text-slate-200 transition hover:bg-slate-700"
              title={user?.email || user?.username || 'Account'}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">
                  {avatarText}
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Account
                  </span>
                  <span className="block truncate text-xs text-slate-200">
                    {user?.email || user?.username || 'Signed in'}
                  </span>
                </div>
              </div>
            </button>

            {accountMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Sign out
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleClearHistory();
                  }}
                  className="mt-1 w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-rose-200 hover:bg-rose-900/50"
                >
                  Clear all history
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;
