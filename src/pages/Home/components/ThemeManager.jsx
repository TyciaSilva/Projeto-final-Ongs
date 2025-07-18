// src/components/ThemeManager.jsx
import { useEffect } from 'react';

function ThemeManager({ textSize, highContrast, darkMode }) {
  useEffect(() => {
    const body = document.body;

    // Remove classes antigas
    body.classList.remove(
      'text-size-0',
      'text-size-1',
      'text-size-2',
      'text-size-3',
      'high-contrast',
      'dark-mode'
    );

    body.classList.add(`text-size-${textSize}`);
    if (highContrast) body.classList.add('high-contrast');
    if (darkMode) body.classList.add('dark-mode');
  }, [textSize, highContrast, darkMode]);

  return null; 
}

export default ThemeManager;
