import React, { useEffect, useRef } from 'react';

const InputForm = ({ onSubmit, isLoading, prompt, mode, setPrompt, setMode }) => {
  const textareaRef = useRef(null);


  const modes = [
    { value: 'explain', label: 'Explain a Concept', placeholder: 'e.g., Explain how React hooks work' },
    { value: 'mcq', label: 'Generate Multiple-Choice Questions', placeholder: 'e.g., JavaScript async/await' },
    { value: 'summarize', label: 'Summarize Text', placeholder: 'Paste the text you want summarized...' },
    { value: 'improve', label: 'Improve Writing Quality', placeholder: 'Paste the text you want to improve...' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Please enter some text');
      return;
    }

    onSubmit(prompt, mode);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && prompt.trim().length >= 3) {
        onSubmit(prompt, mode);
      }
    }
  };

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [prompt]);

  const selectedMode = modes.find(m => m.value === mode);

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white/90 p-15 shadow-lg backdrop-blur">
      <div className="mb-6">
        <label htmlFor="mode-select" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
          Select Task Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {modes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="prompt-input" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
          Your Input
        </label>
        <textarea
          id="prompt-input"
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedMode?.placeholder}
          className="w-full min-h-40 resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
          rows="1"
          style={{ overflow: 'hidden' }}
          disabled={isLoading}
          maxLength="5000"
        />
        <div className="text-right text-xs text-slate-500 mt-2">
          {wordCount} words • {prompt.length} / 5000 characters
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || prompt.trim().length < 3}
        className="w-full rounded-xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:transform-none"
      >
        {isLoading ? 'Generating...' : 'Generate Response'}
      </button>

    </form>
  );
};

export default InputForm;
