"use client";

import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-[#18142a] border border-[#2a2447] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm ${
          error ? "border-red-500/80 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-red-400 font-medium">{error}</span>}
    </div>
  );
};