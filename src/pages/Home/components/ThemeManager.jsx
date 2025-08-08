// src/components/ThemeManager.js
import { useEffect } from 'react';

const ThemeManager = ({ textSize, highContrast, darkMode }) => {
  useEffect(() => {
    const body = document.body;
    
    // Limpar classes anteriores
    body.classList.remove(
      'high-contrast', 
      'dark-mode',
      'text-size-0',
      'text-size-1',
      'text-size-2',
      'text-size-3'
    );
    
    // Adicionar classes atuais
    if (highContrast) body.classList.add('high-contrast');
    if (darkMode) body.classList.add('dark-mode');
    body.classList.add(`text-size-${textSize}`);
    
    // Criar ou atualizar o estilo de variáveis CSS
    let style = document.getElementById('theme-variables');
    if (!style) {
      style = document.createElement('style');
      style.id = 'theme-variables';
      document.head.appendChild(style);
    }
    
    // Definir variáveis CSS para todos os temas
    let css = `
      :root {
        /* Variáveis para modo claro */
        --text-color: #333;
        --bg-color: #f8f9fa;
        --primary-color: #4a6fa5;
        --secondary-color: #3498db;
        --accent-color: #ff6b6b;
        --surface-color: #ffffff;
        --card-color: #ffffff;
        --border-color: #e0e0e0;
        --shadow-color: rgba(0,0,0,0.1);
      }
      
      body.dark-mode {
        /* Variáveis para modo escuro */
        --text-color: #e0e0e0;
        --bg-color: #121212;
        --primary-color: #bb86fc;
        --secondary-color: #03dac6;
        --accent-color: #ff7597;
        --surface-color: #1e1e1e;
        --card-color: #2d2d2d;
        --border-color: #444;
        --shadow-color: rgba(0,0,0,0.3);
      }
      
      body.high-contrast {
        /* Variáveis para alto contraste */
        --text-color: #ffffff;
        --bg-color: #000000;
        --primary-color: #ffff00;
        --secondary-color: #00ffff;
        --accent-color: #ff00ff;
        --surface-color: #000000;
        --card-color: #000000;
        --border-color: #ffff00;
        --shadow-color: rgba(255,255,0,0.3);
      }
    `;
    
    style.innerHTML = css;
    
  }, [textSize, highContrast, darkMode]);

  return null;
};

export default ThemeManager;