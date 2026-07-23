"use client";

import React from "react";

interface TabOption<T extends string> {
  id: T;
  label: string;
  badgeCount?: number;
}

interface SegmentedTabsProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
}

export function SegmentedTabs<T extends string>({
  options,
  activeTab,
  onChange,
}: SegmentedTabsProps<T>) {
  return (
    <div className="flex bg-[#18142a] p-1.5 rounded-2xl border border-[#2a2447] w-full">
      {options.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              isActive
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badgeCount !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#2a2447] text-gray-400"
                }`}
              >
                {tab.badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}