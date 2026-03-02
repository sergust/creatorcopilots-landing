'use client';

import { useState, useCallback } from 'react';
import config from '@/config';

// Inline validation — duplicated from app (no shared package)
const INSTAGRAM_REEL_PATTERN =
  /^https?:\/\/(www\.)?instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)\/?/i;

function isValidInstagramReelUrl(url: string): boolean {
  try {
    return INSTAGRAM_REEL_PATTERN.test(url.trim());
  } catch {
    return false;
  }
}

export default function LandingHeroInput() {
  const [url, setUrl] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setError(null);
    if (!value.trim()) {
      setValidationState('idle');
    } else {
      setValidationState(isValidInstagramReelUrl(value) ? 'valid' : 'invalid');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValidInstagramReelUrl(url)) {
      setError('Enter a valid Instagram Reel link (e.g. instagram.com/reel/...)');
      return;
    }
    window.location.href = `${config.appUrl}/?url=${encodeURIComponent(url.trim())}`;
  }, [url]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && validationState === 'valid') {
        handleSubmit();
      }
    },
    [validationState, handleSubmit]
  );

  const borderClass =
    validationState === 'valid'
      ? 'border-success'
      : validationState === 'invalid'
        ? 'border-error'
        : 'border-base-300';

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`flex items-center rounded-full border-2 bg-base-100 transition-all duration-300 ${borderClass}`}
      >
        <input
          type="url"
          className="flex-1 min-w-0 bg-transparent px-4 sm:px-6 py-4 text-base outline-none placeholder:text-base-content/30"
          placeholder="Paste your Instagram Reel link..."
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={validationState === 'invalid'}
          className={`
            btn btn-primary rounded-full h-12 mr-1.5 text-sm font-semibold
            transition-all duration-200 whitespace-nowrap px-4 sm:px-6
            ${validationState === 'valid' ? 'hover:scale-105 shadow-lg shadow-primary/20' : ''}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Boost Your Reach</span>
          <span className="sm:hidden">Analyze</span>
        </button>
      </div>
      {error && (
        <p className="text-sm text-error mt-3 text-center">{error}</p>
      )}
      <p className="text-sm text-base-content/40 mt-4 text-center">
        Free hook analysis &middot; No sign-up required &middot; Results in 30 seconds
      </p>
    </div>
  );
}
