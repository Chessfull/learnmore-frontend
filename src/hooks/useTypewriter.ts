import { useEffect, useState } from 'react';

export function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;

        // Add pause after punctuation
        const currentChar = text[index - 1];
        if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
          clearInterval(timer);
          setTimeout(() => {
            const newTimer = setInterval(() => {
              if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
              } else {
                clearInterval(newTimer);
                setIsComplete(true);
              }
            }, speed);
          }, 300); // 300ms pause after punctuation
        }
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

