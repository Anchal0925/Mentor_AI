import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Play } from 'lucide-react';

export function SessionReplay() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-primary">Session Replay</h2>
        <span className="font-mono text-xs text-muted">2 Recorded</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <Card key={i} className="flex flex-col relative overflow-hidden group p-0">
            <div className="h-24 bg-code flex items-center justify-center border-b border-border opacity-80 group-hover:opacity-100 transition-opacity">
              <Play className="w-8 h-8 text-accent-green/50 group-hover:text-accent-green transition-colors" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm text-primary">Two Sum Attempt {i}</h3>
                <span className="font-mono text-[10px] text-muted">Mar 1{i}, 2026</span>
              </div>
              <Button variant="ghost-green" className="text-xs px-3 py-1.5 h-auto" onClick={() => setModalOpen(true)}>
                Watch
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Session Replay: Two Sum">
        <div className="w-full h-[400px] bg-code rounded-lg border border-border flex items-center justify-center font-mono text-sm text-accent-green">
          <p className="animate-pulse">Loading keystroke playback...</p>
        </div>
      </Modal>
    </>
  );
}
