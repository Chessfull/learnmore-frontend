'use client';

interface CountdownTimerProps {
  timeLeft: number;
  totalTime: number;
}

export function CountdownTimer({ timeLeft, totalTime }: CountdownTimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="countdown-timer">
      <svg width="80" height="80" className="timer-svg">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="timer-circle-bg"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          className={`timer-circle ${isWarning ? 'timer-warning' : ''} ${isCritical ? 'timer-critical' : ''}`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      <div className={`timer-text ${isWarning ? 'text-warning' : ''} ${isCritical ? 'text-critical' : ''}`}>
        {timeLeft}
      </div>
    </div>
  );
}

