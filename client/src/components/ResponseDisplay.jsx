import React, { useState } from 'react';

const ResponseDisplay = ({ response, mode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      let textToCopy = '';

      if (mode === 'mcq' && response.response?.questions) {
        textToCopy = response.response.questions
          .map(
            (q, i) =>
              `Question ${i + 1}: ${q.question}\n${Object.entries(q.options)
                .map(([key, value]) => `${key}. ${value}`)
                .join('\n')}\nCorrect Answer: ${q.correct}\nExplanation: ${q.explanation}`
          )
          .join('\n\n');
      } else {
        textToCopy = response.response;
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!response) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 shadow-(--shadow-md)">
        <p className="text-rose-700 text-sm">Error: No response data to display</p>
      </div>
    );
  }

  const renderResponse = () => {
    if (mode === 'mcq' && response.response?.questions) {
      return (
        <div className="space-y-6">
          <h3 className="text-slate-900 text-lg font-semibold">Generated Questions</h3>
          {response.response.questions.map((q, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-(--shadow-sm)">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span>Question {index + 1}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] text-blue-700">MCQ</span>
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900">{q.question}</p>

              <div className="mt-5 grid gap-3">
                {Object.entries(q.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`relative rounded-xl border px-4 py-3 text-sm text-slate-700 shadow-sm transition-all ${key === q.correct ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-blue-300'}`}
                  >
                    <span className="mr-2 font-semibold text-slate-900">{key}.</span>
                    {value}
                    {key === q.correct && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold text-white">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // For other modes, display as formatted text
    return (
      <div>
        <h3 className="text-slate-900 text-lg font-semibold border-b border-slate-200 pb-3">
          {mode === 'explain' && 'Explanation'}
          {mode === 'summarize' && 'Summary'}
          {mode === 'improve' && 'Improved Version'}
        </h3>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
          {response.response.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-(--shadow-lg) overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between bg-slate-900 px-8 py-5 text-white">
        <h2 className="text-lg font-semibold">AI Response</h2>
        <button
          onClick={handleCopy}
          className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-8">
        {renderResponse()}
      </div>
    </div>
  );
};

export default ResponseDisplay;
