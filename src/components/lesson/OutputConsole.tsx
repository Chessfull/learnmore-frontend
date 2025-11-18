'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface TestResult {
  title: string;
  passed: boolean;
  expected_output: string;
  actual_output: string;
  execution_time?: number;
}

interface OutputConsoleProps {
  output: string;
  testResults: TestResult[];
  mode: 'idle' | 'run' | 'submit';
}

export function OutputConsole({ output, testResults, mode }: OutputConsoleProps) {
  return (
    <div className="output-console">
      {/* Console Header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">
          {mode === 'submit' ? 'Test Results' : 'Output'}
        </span>
        {mode === 'submit' && testResults.length > 0 && (
          <span className="text-xs text-white/50">
            {testResults.filter(t => t.passed).length}/{testResults.length} passed
          </span>
        )}
      </div>

      {/* Output/Results Content */}
      <div className="p-4 space-y-3">
        {/* General Output */}
        {output && (
          <div className="text-sm font-mono text-white/80 whitespace-pre-wrap">
            {output}
          </div>
        )}

        {/* Test Results */}
        {mode === 'submit' && testResults.length > 0 && (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`test-result ${result.passed ? 'test-passed' : 'test-failed'}`}
              >
                <div className="flex items-start gap-3">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{result.title}</p>
                    
                    {!result.passed && (
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-white/50">Expected: </span>
                          <code className="text-white/70">{result.expected_output}</code>
                        </div>
                        <div>
                          <span className="text-white/50">Got: </span>
                          <code className="text-white/70">{result.actual_output}</code>
                        </div>
                      </div>
                    )}
                    
                    {result.execution_time && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{result.execution_time}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!output && testResults.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">
            {mode === 'idle' ? 'Run your code to see the output here' : 'Loading...'}
          </div>
        )}
      </div>
    </div>
  );
}

