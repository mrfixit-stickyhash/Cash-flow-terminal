import { Panel, Group, Separator } from "react-resizable-panels";
import { QuoteCard } from "./QuoteCard";
import { Tape } from "./Tape";
import { AlertsLog } from "./AlertsLog";
import { ChartPanel } from "./ChartPanel";
import { InsightFeed } from "./InsightFeed";
import { BottomTabs } from "./BottomTabs";

export function SplitLayout() {
  return (
    <Group direction="horizontal" className="h-[calc(100vh-48px)] w-full overflow-hidden bg-zinc-950">
      {/* Left Panel: Quote, Tape, Alerts */}
      <Panel defaultSize={20} minSize={15} className="flex flex-col border-r border-zinc-800">
        <div className="flex-1 overflow-hidden flex flex-col">
          <QuoteCard />
          <div className="h-px bg-zinc-800" />
          <Tape />
          <div className="h-px bg-zinc-800" />
          <AlertsLog />
        </div>
      </Panel>

      <Separator className="w-1 bg-zinc-800 hover:bg-indigo-500/50 transition-colors cursor-col-resize" />

      {/* Center Panel: Chart & Bottom Tabs */}
      <Panel defaultSize={55} minSize={30} className="flex flex-col">
        <Group direction="vertical">
          <Panel defaultSize={70} minSize={40} className="flex flex-col">
            <ChartPanel />
          </Panel>
          <Separator className="h-1 bg-zinc-800 hover:bg-indigo-500/50 transition-colors cursor-row-resize" />
          <Panel defaultSize={30} minSize={20} className="flex flex-col bg-zinc-900/50">
            <BottomTabs />
          </Panel>
        </Group>
      </Panel>

      <Separator className="w-1 bg-zinc-800 hover:bg-indigo-500/50 transition-colors cursor-col-resize" />

      {/* Right Panel: AI Insights */}
      <Panel defaultSize={25} minSize={20} className="flex flex-col border-l border-zinc-800 bg-zinc-900/30">
        <InsightFeed />
      </Panel>
    </Group>
  );
}
