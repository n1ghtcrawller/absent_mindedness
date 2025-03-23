import React, { useState, useEffect, useRef } from 'react';
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

const SYMBOLS = [
  { id: '7', src: seven, type: 'regular', weight: 18 },
  { id: '8', src: eight, type: 'regular', weight: 18 },
  { id: '9', src: nine, type: 'regular', weight: 14 },
  { id: '10', src: ten, type: 'regular', weight: 14 },
  { id: 'j', src: jack, type: 'regular', weight: 12 },
  { id: 'q', src: queen, type: 'regular', weight: 14 },
  { id: 'wild', src: wild, type: 'wild', weight: 5 },
  { id: 'scatter', src: scatter, type: 'scatter', weight: 2 },
  { id: 'bonus', src: bonus, type: 'bonus', weight: 1 },
  { id: 'multiplier', src: multiplier, type: 'multiplier', weight: 3 },
];

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

const getWeightedSymbol = () => {
  const random = Math.random() * TOTAL_WEIGHT;
  let accumulator = 0;
  for (const symbol of SYMBOLS) {
    accumulator += symbol.weight;
    if (random < accumulator) return symbol;
  }
  return SYMBOLS[0];
};

const SlotMachine = ({ userId }) => {
  const [reels, setReels] = useState(() =>
      Array(5).fill().map(() => Array(3).fill().map(getWeightedSymbol))
  );
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [winningPositions, setWinningPositions] = useState([]);
  const [isSpinningReels, setIsSpinningReels] = useState(Array(5).fill(false));
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const newReelsRef = useRef(null);

  useEffect(() => {
    SYMBOLS.forEach(({ src }) => {
      new Image().src = src;
    });

    const loadBalance = async () => {
      try {
        const response = await fetch(`/api/get_balance/${userId}`);
        if (!response.ok) throw new Error('Balance load failed');
        const { balance } = await response.json();
        setBalance(balance);
      } catch (error) {
        setResult('Ошибка загрузки баланса');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [userId]);

  const updateBalance = async (amount) => {
    try {
      const response = await fetch(`/api/add_balance/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error('Balance update failed');
      const { new_balance } = await response.json();
      setBalance(new_balance);
    } catch (error) {
      console.error('Balance update error:', error);
    }
  };

  const spin = async () => {
    if (isLoading) return;
    if (betAmount <= 0 || betAmount > 1000) {
      setResult('Некорректная ставка!');
      return;
    }

    if (balance < betAmount) {
      setResult('Недостаточно средств!');
      return;
    }

    try {
      // Списание ставки
      const reduceResponse = await fetch(`/api/reduce_balance/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: betAmount })
      });

      if (!reduceResponse.ok) throw new Error('Списание не удалось');
      const { new_balance } = await reduceResponse.json();
      setBalance(new_balance);

      // Запуск вращения
      setSpinning(true);
      setResult('');
      setWinningPositions([]);
      setIsSpinningReels(Array(5).fill(true));

      const newReels = Array(5).fill().map(() =>
          Array(3).fill().map(getWeightedSymbol)
      );
      newReelsRef.current = newReels;

      await new Promise(resolve => setTimeout(resolve, 500));

      for (let col = 0; col < 5; col++) {
        setReels(prev => {
          const updated = [...prev];
          updated[col] = newReels[col];
          return updated;
        });

        setIsSpinningReels(prev => {
          const next = [...prev];
          next[col] = false;
          return next;
        });

        const hasScatter = newReels[col].some(s => s.type === 'scatter');
        await new Promise(resolve => setTimeout(resolve, hasScatter ? 800 : 200));
      }

      // Проверка выигрыша
      const winData = checkWin(newReels);
      if (winData.amount > 0) {
        await updateBalance(winData.amount);
        setResult(`${winData.message} +${winData.amount}`);
      } else {
        setResult('Повезет в следующий раз!');
      }

    } catch (error) {
      console.error('Spin error:', error);
      setResult('Ошибка операции');
    } finally {
      setSpinning(false);
    }
  };

  const checkWin = (reels) => {
    let winMessage = '';
    let winAmount = 0;
    let winPositions = [];

    const scatterCount = reels.flat().filter(s => s.type === 'scatter').length;
    if (scatterCount >= 3) {
      winMessage = 'Free Spins Activated!';
      winAmount = betAmount * 15;
      winPositions = reels.flatMap((reel, col) =>
          reel.map((s, row) => s.type === 'scatter' ? { col, row } : null)
      ).filter(Boolean);
    } else {
      const winningLines = [
        [ { col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 }, { col: 3, row: 0 }, { col: 4, row: 0 } ],
        [ { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 4, row: 1 } ],
        [ { col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 } ],
        [ { col: 0, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 2 }, { col: 3, row: 1 }, { col: 4, row: 0 } ],
        [ { col: 0, row: 2 }, { col: 1, row: 1 }, { col: 2, row: 0 }, { col: 3, row: 1 }, { col: 4, row: 2 } ],
      ];

      const calculateWin = (symbol, consecutive) => {
        const multipliers = {
          'wild': 5000,
          'multiplier': consecutive * 3,
          'bonus': 20,
          '7': 10, '8': 8, '9': 7, '10': 6, 'j': 5, 'q': 5
        };
        return betAmount * (multipliers[symbol] || 0);
      };

      for (const line of winningLines) {
        const lineSymbols = line.map(({ col, row }) => reels[col][row]);
        const consecutive = countConsecutive(lineSymbols);

        if (lineSymbols[0].type === 'wild' && consecutive === 5) {
          winAmount = calculateWin('wild');
          winMessage = 'JACKPOT WIN 5000x!';
          break;
        }

        if (consecutive >= 3) {
          const symbolType = lineSymbols[0].type;
          const win = calculateWin(symbolType === 'regular' ? lineSymbols[0].id : symbolType, consecutive);

          if (win > winAmount) {
            winAmount = win;
            winMessage = `${lineSymbols[0].id.toUpperCase()} x${consecutive} Win!`;
            winPositions = line.slice(0, consecutive);
          }
        }
      }
    }

    setWinningPositions(winPositions);
    return { message: winMessage, amount: winAmount };
  };

  const countConsecutive = (lineSymbols) => {
    let count = 1;
    for (let i = 1; i < lineSymbols.length; i++) {
      if (lineSymbols[i].id === lineSymbols[0].id) count++;
      else break;
    }
    return count;
  };

  const isWinningPosition = (col, row) => {
    return winningPositions.some(pos => pos.col === col && pos.row === row);
  };

  const handleBetChange = (amount) => {
    if (amount >= 0 && amount <= 1000) {
      setBetAmount(Math.floor(amount));
    }
  };

  return (
      <div className="slot-machine">
        <div className="balance-panel">
          <div className="balance-display">
            {isLoading ? 'Загрузка...' : `Баланс: ${balance}`}
          </div>

          <div className="bet-controls">
            <input
                type="number"
                value={betAmount}
                onChange={(e) => handleBetChange(e.target.value)}
                min="1"
                max="1000"
                disabled={spinning || isLoading}
                className="bet-input"
            />

            <div className="quick-bets">
              {[1, 2, 5].map((amount) => (
                  <button
                      key={amount}
                      onClick={() => handleBetChange(amount)}
                      disabled={spinning || isLoading}
                      className="bet-button"
                  >
                    {amount}
                  </button>
              ))}
            </div>
          </div>
        </div>

        <div className="reels">
          {reels.map((reel, col) => (
              <div
                  key={col}
                  className={`reel-column ${isSpinningReels[col] ? 'spinning' : ''}`}
              >
                {reel.map((symbol, row) => (
                    <div
                        key={`${col}-${row}`}
                        className={`symbol ${isWinningPosition(col, row) ? 'winning' : ''}`}
                    >
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
            disabled={spinning || isLoading || balance < betAmount}
            className="spin-btn"
        >
          {spinning ? 'Крутим...' : `Играть за ${betAmount}`}
        </button>

        {result && <div className="result-message">{result}</div>}
      </div>
  );
};

export default SlotMachine;