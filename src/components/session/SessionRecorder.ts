/**
 * SessionRecorder
 * 
 * Captures behavioral data during a live coding session (keystrokes, timing, pauses)
 * without rendering UI. Connects to backend WebSocket or processes locally.
 */
export class SessionRecorder {
  private startTime: number;
  private keystrokes: Array<{ timestamp: number; type: string; key?: string }>;
  private isRecording: boolean;

  constructor() {
    this.startTime = Date.now();
    this.keystrokes = [];
    this.isRecording = false;
  }

  start() {
    this.isRecording = true;
    this.startTime = Date.now();
    console.log('[MentorMind SessionRecorder] Started recording behavior.');
  }

  recordKey(type: 'type' | 'backspace' | 'paste' | 'delete', key?: string) {
    if (!this.isRecording) return;
    this.keystrokes.push({
      timestamp: Date.now() - this.startTime,
      type,
      key
    });
  }

  pause() {
    this.isRecording = false;
    console.log('[MentorMind SessionRecorder] Paused recording.');
  }

  getMetrics() {
    const totalTime = Date.now() - this.startTime;
    const backspaceCount = this.keystrokes.filter(k => k.type === 'backspace').length;
    
    return {
      totalKeystrokes: this.keystrokes.length,
      backspaceCount,
      hesitationRatio: backspaceCount / (this.keystrokes.length || 1),
      totalTimeMs: totalTime
    };
  }

  flush() {
    const data = [...this.keystrokes];
    this.keystrokes = [];
    return data;
  }
}

export const sessionRecorder = new SessionRecorder();
