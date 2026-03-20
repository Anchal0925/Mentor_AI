import React, { useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Play, Columns, MoreHorizontal, FileCode } from 'lucide-react';
import { OutputConsole } from './OutputConsole';

export function CodeEditor() {
  const [activeTab, setActiveTab] = useState('main.py');
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const monaco = useMonaco();

  const tabs = [
    { id: 'main.py', label: 'main.py', icon: <FileCode className="w-4 h-4" /> },
    { id: 'solution.py', label: 'solution.py', icon: <FileCode className="w-4 h-4" /> }
  ];

  // Configure custom Monaco theme
  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('mentorMindTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '5a5a72', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'a78bfa' },
          { token: 'identifier', foreground: 'f1f1f5' },
          { token: 'string', foreground: '4ade80' },
          { token: 'number', foreground: 'fbbf24' }
        ],
        colors: {
          'editor.background': '#0a0a0f',
          'editor.lineHighlightBackground': '#131318',
          'editorLineNumber.foreground': '#5a5a72',
          'editorIndentGuide.background': '#1e1e2c',
          'editorSuggestWidget.background': '#131318',
          'editorSuggestWidget.border': '#1e1e2c',
        }
      });
      monaco.editor.setTheme('mentorMindTheme');
    }
  }, [monaco]);

  const defaultCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test cases
print(twoSum([2, 7, 11, 15], 9))
`;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f] relative border-r border-border">
      {/* Editor top bar */}
      <div className="h-9 w-full bg-[#08080c] flex items-center justify-between border-b border-[#1e1e2c] shrink-0">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="vscode" className="flex-1" />
        <div className="flex items-center gap-2 px-3 text-secondary shrink-0">
          <button className="hover:text-primary transition-colors p-1"><Columns className="w-4 h-4" /></button>
          <button className="hover:text-primary transition-colors p-1"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language="python"
          theme="mentorMindTheme"
          value={defaultCode}
          options={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            minimap: { enabled: false },
            lineHeight: 24,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on"
          }}
        />
        
        {/* Floating action bar inside editor */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted">⌘ + Enter to Run</span>
          <Button variant="ghost-green" className="py-2 px-4 text-sm font-semibold rounded-md backdrop-blur-md bg-[#0a0a0f]/80">
            Submit
          </Button>
          <Button variant="primary" className="py-2 px-5 text-sm font-semibold rounded-md flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            Run Code
          </Button>
        </div>
      </div>

      <OutputConsole isCollapsed={consoleCollapsed} onToggleCollapse={() => setConsoleCollapsed(!consoleCollapsed)} />
    </div>
  );
}
