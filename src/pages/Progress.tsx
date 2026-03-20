import React from 'react';
import { RadarChart } from '../components/dashboard/RadarChart';
import { BehaviorFlags } from '../components/dashboard/BehaviorFlags';
import { SessionTimeline } from '../components/dashboard/SessionTimeline';
import { ConceptGraph } from '../components/dashboard/ConceptGraph';
import { SessionReplay } from '../components/dashboard/SessionReplay';

export default function Progress() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-semibold text-primary">Progress & Memory Dashboard</h1>
        <p className="text-secondary font-body">Visualize your mastery, behavioral patterns, and session history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Skill Profile & Replay */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
            <RadarChart />
            <ConceptGraph />
          </div>
          
          <div className="mt-8">
            <BehaviorFlags />
          </div>

          <div className="mt-8">
            <SessionReplay />
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <div className="sticky top-[80px]">
            <SessionTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
