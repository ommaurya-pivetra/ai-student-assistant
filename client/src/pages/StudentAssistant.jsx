import React, { useState, useEffect } from 'react';
import InputForm from '../components/InputForm';
import ResponseDisplay from '../components/ResponseDisplay';
import ChatHistorySidebar from '../components/ChatHistorySidebar';
import {
  generateAIResponse,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  saveChat,
  getChatById
} from '../services/api.service';

const StudentAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [currentMode, setCurrentMode] = useState('explain');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    const loadUser = async () => {
      setAuthLoading(true);
      try {
        const result = await getCurrentUser();
        setUser(result.data.user);
      } catch (err) {
        logoutUser();
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  // Auto-save draft prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('draft_prompt', currentPrompt);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPrompt]);

  // Auto-save selected mode
  useEffect(() => {
    localStorage.setItem('draft_mode', currentMode);
  }, [currentMode]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const action = authMode === 'login' ? loginUser : registerUser;
      const result = authMode === 'login' 
        ? await action(authForm.email, authForm.password)
        : await action(authForm.email, authForm.password, authForm.username);
      setUser(result.data.user);
      setAuthForm({ email: '', password: '', username: '' });
    } catch (err) {
      let errorMessage = 'Authentication failed. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setResponse(null);
    setError(null);
    setCurrentChatId(null);
  };

  const handleSelectChat = async (chatId) => {
    setCurrentChatId(chatId);
    setLoading(true);
    setSidebarOpen(false);

    try {
      const result = await getChatById(chatId);
      const chat = result.data.chat;
      setCurrentPrompt(chat.prompt);
      setCurrentMode(chat.mode);
      setResponse(chat.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (prompt, mode) => {
    setError(null);
    setResponse(null);
    setLoading(true);
    setCurrentMode(mode);
    setCurrentPrompt(prompt);
    setCurrentChatId(null);

    try {
      const result = await generateAIResponse(prompt, mode);
      setResponse(result.data);

      try {
          await saveChat(prompt, mode, result.data);
          setHistoryRefreshKey((prev) => prev + 1);
      } catch (saveErr) {
        console.warn('Failed to save chat:', saveErr);
      }
    } catch (err) {
      let errorMessage = 'Failed to generate response. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else {
        errorMessage = JSON.stringify(err);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-linear-to-br from-slate-50 via-white to-slate-100">
      {user && (
        <ChatHistorySidebar
          onSelectChat={handleSelectChat}
          currentChatId={currentChatId}
          isOpen={sidebarOpen}
          user={user}
          refreshKey={historyRefreshKey}
          onLogout={handleLogout}
        />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed md:hidden bottom-6 right-6 z-30 rounded-full bg-blue-600 text-white p-3 shadow-lg hover:bg-blue-700 transition-all"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <div className="flex-1 overflow-scroll">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {!user && (
          <header className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur">
              Student Assistant
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold text-slate-900">
              Ask • Explain • Summarize • Improve
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              An interactive AI tool that generates structured responses based on selected learning tasks.
            </p>
          </header>
        )}

        <main className="flex-1 justify-center items-center flex min-h-[calc(100vh-10rem)] flex-col gap-8">
          {!user && (
            <div className="rounded-2xl w-full max-w-md mx-auto border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur">
              <div className="flex  flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Authentication</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {authMode === 'login' ? 'Sign in to continue' : 'Create your account'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-300"
                >
                  {authMode === 'login' ? 'Need an account?' : 'Have an account?'}
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="mt-6 grid gap-4">
                {authMode === 'register' && (
                  <input
                    type="text"
                    placeholder="Username"
                    value={authForm.username}
                    onChange={(event) =>
                      setAuthForm((prev) => ({ ...prev, username: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                    required={authMode === 'register'}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email address"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                  minLength={6}
                  required
                />
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthError(null)}
                    className="text-xs text-slate-600 hover:text-slate-900 text-left transition"
                  >
                    Forgot password?
                  </button>
                )}
                {authError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                    {authError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="rounded-xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {authLoading
                    ? 'Processing...'
                    : authMode === 'login'
                      ? 'Sign in'
                      : 'Create account'}
                </button>
              </form>
            </div>
          )}

          {user ? (
            <div className="w-full max-w-5xl mx-auto ">
              <InputForm 
                onSubmit={handleSubmit} 
                isLoading={loading}
                prompt={currentPrompt}
                mode={currentMode}
                setPrompt={setCurrentPrompt}
                setMode={setCurrentMode}
              />
            </div>
          ) : (
            <div className="rounded-2xl max-w-md mx-auto border border-slate-200 bg-white/80 p-8 text-center shadow-md backdrop-blur">
              <p className="text-sm text-slate-600">
                Sign in to unlock AI explanations, summaries, and writing improvements.
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center shadow-md backdrop-blur">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
              <p className="text-base text-slate-600">Generating response...</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-md backdrop-blur">
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-rose-700 text-sm sm:text-base leading-relaxed">{error}</p>
            </div>
          )}

          {response && !loading && (
            <ResponseDisplay response={response} mode={currentMode} />
          )}

        </main>
        </div>
      </div>
    </div>
  );
};

export default StudentAssistant;
