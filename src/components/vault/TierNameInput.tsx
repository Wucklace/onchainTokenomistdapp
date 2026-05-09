'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { sanitizeText } from '@/utils/sanitize';

const TIER_SUGGESTIONS = [
  'Diamond',
  'Platinum',
  'Gold',
  'Silver',
  'Bronze',
  'VIP',
  'Standard',
  'Premium',
];

interface TierNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  usedNames?: string[];
  index?: number;
}

export function TierNameInput({
  value,
  onChange,
  error,
  usedNames = [],
  index,
}: TierNameInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeText(e.target.value) ?? '';
    onChange(sanitized);
  };

  const handleSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const availableSuggestions = TIER_SUGGESTIONS.filter(
    (s) => !usedNames.includes(s) && s !== value
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        label={index !== undefined ? `Tier ${index + 1} Name` : 'Tier Name'}
        placeholder="e.g. Gold, Silver..."
        value={value}
        onChange={handleInput}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        error={error}
        variant="neonOrange"
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
                <Badge variant="neonOrange" size="sm">
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