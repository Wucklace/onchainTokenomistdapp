'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { sanitizeText } from '@/utils/sanitize';

const CATEGORY_SUGGESTIONS = [
  'Team',
  'Investors',
  'Community',
  'Partners',
  'Advisors',
  'Ecosystem',
  'Treasury',
  'Marketing',
];

interface CategoryNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  usedNames?: string[];
}

export function CategoryNameInput({
  value,
  onChange,
  error,
  usedNames = [],
}: CategoryNameInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeText(e.target.value) ?? '';
    onChange(sanitized);
  };

  const handleSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const availableSuggestions = CATEGORY_SUGGESTIONS.filter(
    (s) => !usedNames.includes(s) && s !== value
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        label="Category Name"
        placeholder="e.g. Team, Investors..."
        value={value}
        onChange={handleInput}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        error={error}
        variant="neonBlue"
        fullWidth
      />

      {/* Suggestions */}
      {showSuggestions && availableSuggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestion(suggestion);
                }}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <Badge variant="ghost" size="sm">
                  {suggestion}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}