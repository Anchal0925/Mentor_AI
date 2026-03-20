import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SessionTopBar } from '../components/layout/SessionTopBar';
import { ProblemPanel } from '../components/session/ProblemPanel';
import { CodeEditor } from '../components/session/CodeEditor';
import { TutorPanel } from '../components/session/TutorPanel';
import { sessionRecorder } from '../components/session/SessionRecorder';

export default function Session() {
  const { id } = useParams();
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    // Start behavioral tracking
    sessionRecorder.start();

    // Mock Timer
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }, 1000);

    return () => {
      clearInterval(interval);
      sessionRecorder.pause();
    };
  }, []);

  return (
    <div className="h-screen w-full bg-primary flex flex-col overflow-hidden text-primary">
      <SessionTopBar 
        title={`Two Sum (ID: ${id || 'new'})`} 
        timeRunning={time} 
      />

      <div className="flex-1 overflow-hidden grid grid-cols-[280px_1fr_300px]">
        {/* Left Panel: Theory & Problem */}
        <ProblemPanel />

        {/* Center Panel: Editor & Output */}
        <CodeEditor />

        {/* Right Panel: AI Tutor */}
        <TutorPanel />
      </div>
    </div>
  );
}
