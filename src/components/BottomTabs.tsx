import { useState } from "react";
import { FileText, Newspaper, Users, Activity } from "lucide-react";

export function BottomTabs() {
  const [activeTab, setActiveTab] = useState("news");

  const tabs = [
    { id: "news", label: "News", icon: Newspaper },
    { id: "filings", label: "Filings", icon: FileText },
    { id: "peers", label: "Peers", icon: Users },
    { id: "options", label: "Options", icon: Activity },
  ];

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || Newspaper;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 border-t border-zinc-800 h-full">
      <div className="flex border-b border-zinc-800 bg-zinc-900 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400 bg-zinc-800/50"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
          <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
            <ActiveIcon className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-400 capitalize tracking-wide">{activeTab} View</p>
          <p className="text-xs text-zinc-600 font-mono">Coming soon in next update</p>
        </div>
      </div>
    </div>
  );
}
