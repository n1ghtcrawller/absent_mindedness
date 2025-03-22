import React, { useState, useEffect } from 'react';
import seven from '../../assets/slot/7.svg';
import eight from '../../assets/slot/8.svg';
import nine from '../../assets/slot/9.svg';
import ten from '../../assets/slot/10.svg';
import jack from '../../assets/slot/j.svg';
import queen from '../../assets/slot/q.svg';
import wild from '../../assets/slot/wild.gif';
import scatter from '../../assets/slot/scatter.gif';
import bonus from '../../assets/slot/bonus.gif';
import multiplier from '../../assets/slot/multiplier.gif';
import './Game.css';

// Настройки вероятностей
const SYMBOLS = [
  // Стандартные символы (70%)
  { id: '7', src: seven, type: 'regular', weight: 18 },
  { id: '8', src: eight, type: 'regular', weight: 18 },
  { id: '9', src: nine, type: 'regular', weight: 14 },
  { id: '10', src: ten, type: 'regular', weight: 14 },
  { id: 'j', src: jack, type: 'regular', weight: 12 },
  { id: 'q', src: queen, type: 'regular', weight: 14 },

  // Специальные символы
  { id: 'wild', src: wild, type: 'wild', weight: 5 },
  { id: 'scatter', src: scatter, type: 'scatter', weight: 2 },
  { id: 'bonus', src: bonus, type: 'bonus', weight: 1 },
  { id: 'multiplier', src: multiplier, type: 'multiplier', weight: 3 },
];

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

const getWeightedSymbol = () => {
  const random = Math.random() * TOTAL_WEIGHT;
  let accumulator = 0;
  
  for(const symbol of SYMBOLS) {
    accumulator += symbol.weight;
    if(random < accumulator) return symbol;
  }
  return SYMBOLS[0];
};

const SlotMachine = () => {
  const [reels, setReels] = useState(() => 
    Array(5).fill().map(() => 
      Array(3).fill().map(getWeightedSymbol)
  ));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    SYMBOLS.forEach(({ src }) => {
      new Image().src = src;
    });
  }, []);

  const spin = async () => {
    setSpinning(true);
    setResult('');
    
    // Анимация вращения
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReels = Array(5).fill().map(() => 
      Array(3).fill().map(getWeightedSymbol)
    );
    
    setReels(newReels);
    checkWin(newReels);
    setSpinning(false);
  };

  const checkWin = (reels) => {
    const middleRow = reels.map(reel => reel[1]);
    const allSymbols = middleRow.map(s => s.type);

    // Проверка Scatter
    const scatters = allSymbols.filter(t => t === 'scatter').length;
    if(scatters >= 3) {
      setResult('Free Spins Activated!');
      return;
    }

    // Проверка Wild
    if(allSymbols.every(t => t === 'wild')) {
      setResult('JACKPOT WIN 5000x!');
      return;
    }

    // Проверка множителей
    const multipliers = middleRow.filter(s => s.type === 'multiplier');
    if(multipliers.length > 0) {
      const multiplierValue = multipliers.length * 3;
      setResult(`Multiplier x${multiplierValue} Applied!`);
      return;
    }

    // Проверка бонуса
    if(allSymbols.includes('bonus')) {
      setResult('Bonus Round Started!');
      return;
    }

    // Проверка стандартных комбинаций
    const baseSymbols = middleRow.filter(s => s.type === 'regular');
    if(baseSymbols.length >= 3) {
      const counts = baseSymbols.reduce((acc, s) => {
        acc[s.id] = (acc[s.id] || 0) + 1;
        return acc;
      }, {});

      const maxCount = Math.max(...Object.values(counts));
      if(maxCount >= 3) {
        const symbol = Object.keys(counts).find(k => counts[k] === maxCount);
        setResult(`${symbol.toUpperCase()} x${maxCount * 5} Win!`);
      }
    }
  };

  return (
    <div className="slot-machine">
      <div className={`reels ${spinning ? 'spinning' : ''}`}>
        {reels.map((reel, col) => (
          <div key={col} className="reel-column">
            {reel.map((symbol, row) => (
              <div key={`${col}-${row}`} className="symbol">
                <img 
                  src={symbol.src} 
                  alt={symbol.id}
                  className="symbol-img"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button 
        onClick={spin} 
        disabled={spinning}
        className="spin-btn"
      >
        {spinning ? 'SPINNING...' : 'START SPIN'}
      </button>

      {result && <div className="result-message">{result}</div>}
    </div>
  );
};

export default SlotMachine;