'use client';

import { ReactNode } from 'react';

interface CockpitViewProps {
  children: ReactNode;
}

export function CockpitView({ children }: CockpitViewProps) {
  return (
    <div className="cockpit-container">
      {/* Cockpit Frame Overlay */}
      <div className="cockpit-frame" />
      
      {/* Windshield Content Area */}
      <div className="cockpit-content">
        {children}
      </div>

      {/* Ambient cockpit lights */}
      <div className="cockpit-ambient">
        <div className="ambient-light ambient-left"></div>
        <div className="ambient-light ambient-right"></div>
      </div>
    </div>
  );
}

