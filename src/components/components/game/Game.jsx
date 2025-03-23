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
import BackButton from "../BackButton/BackButton";
import { useTelegram } from "../../../hooks/useTelegram";
import GameRules from "./GameRules/GameRules";

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

const SlotMachine = () => {
  const { user } = useTelegram();
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
  const [bonusRound, setBonusRound] = useState(null);
  const [freeSpins, setFreeSpins] = useState(0);
  const [selectedChests, setSelectedChests] = useState([]);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
  const newReelsRef = useRef(null);

  useEffect(() => {
    SYMBOLS.forEach(({ src }) => {
      new Image().src = src;
    });

    const loadBalance = async () => {
      try {
        const response = await fetch(`https://ab-mind.ru/api/get_balance/${user?.id}`);
        if (!response.ok) throw new Error('Balance load failed');
        const { balance } = await response.json();
        setBalance(balance);
      } catch (error) {
        setResult('Ошибка загрузки баланса');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) loadBalance();
  }, [user?.id]);

  useEffect(() => {
    if (freeSpins > 0 && !spinning) {
      spin();
    }
  }, [freeSpins]);

  const updateBalance = async (amount) => {
    setIsUpdatingBalance(true);
    try {
      const response = await fetch(`https://ab-mind.ru/api/add_balance/${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error('Balance update failed');
      const { new_balance } = await response.json();
      setBalance(new_balance);
    } catch (error) {
      console.error('Balance update error:', error);
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const spin = async (isFreeSpin = false) => {
    if (isLoading || isUpdatingBalance) return;
    if (!isFreeSpin && (betAmount <= 0 || betAmount > 1000)) {
      setResult('Некорректная ставка!');
      return;
    }

    if (!isFreeSpin && balance < betAmount) {
      setResult('Недостаточно средств!');
      return;
    }

    try {
      if (!isFreeSpin) {
        setIsUpdatingBalance(true);
        try {
          const reduceResponse = await fetch(`https://ab-mind.ru/api/reduce_balance/${user?.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: betAmount })
          });
          if (!reduceResponse.ok) throw new Error('Списание не удалось');
          const { new_balance } = await reduceResponse.json();
          setBalance(new_balance);
        } finally {
          setIsUpdatingBalance(false);
        }
      }

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

      const winData = checkWin(newReels);
      if (winData.amount > 0) {
        const totalWin = winData.amount * bonusMultiplier;
        await updateBalance(totalWin);
        setResult(`${winData.message} +${totalWin}`);
      } else if (!winData.message) {
        setResult('Повезет в следующий раз!');
      }

      if (freeSpins > 0) setFreeSpins(prev => prev - 1);
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

    const bonusCount = reels.flat().filter(s => s.type === 'bonus').length;
    if (bonusCount >= 3) {
      if (bonusCount >= 5) {
        setBonusRound('jackpot');
        winMessage = 'Прогрессивный джекпот!';
        winAmount = calculateJackpot();
      } else if (bonusCount === 4) {
        setFreeSpins(10);
        setBonusMultiplier(3);
        winMessage = '10 бесплатных спинов с x3 множителем!';
      } else {
        setBonusRound('chest');
        winMessage = 'Выберите 3 сундука!';
      }
      winPositions = reels.flatMap((reel, col) =>
          reel.map((s, row) => s.type === 'bonus' ? { col, row } : null)
      ).filter(Boolean);
    } else {
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
            'wild': { 3: 500, 4: 2000, 5: 5000 },
            'multiplier': { 3: 3, 4: 5, 5: 10 },
            '7': { 3: 5, 4: 10, 5: 20 },
            '8': { 3: 5, 4: 10, 5: 20 },
            '9': { 3: 6, 4: 12, 5: 25 },
            '10': { 3: 7, 4: 15, 5: 30 },
            'j': { 3: 8, 4: 18, 5: 40 },
            'q': { 3: 10, 4: 25, 5: 50 }
          };

          const symbolKey = symbol.type === 'regular' ? symbol.id : symbol.type;
          return betAmount * (multipliers[symbolKey]?.[consecutive] || 0);
        };

        for (const line of winningLines) {
          const lineSymbols = line.map(({ col, row }) => reels[col][row]);
          const consecutive = countConsecutive(lineSymbols);

          if (consecutive >= 3) {
            const symbolType = lineSymbols[0].type;
            const symbol = symbolType === 'regular' ? lineSymbols[0].id : symbolType;
            const win = calculateWin(lineSymbols[0], consecutive);

            // Определение сообщения в зависимости от количества символов
            let comboMessage;
            switch(consecutive) {
              case 3: comboMessage = 'x3 Комбо!'; break;
              case 4: comboMessage = 'x5 Мега Комбо!!'; break;
              case 5: comboMessage = 'x10 УЛЬТРА КОМБО!!!'; break;
              default: comboMessage = '';
            }

            if (win > winAmount) {
              winAmount = win;
              winMessage = `${lineSymbols[0].id.toUpperCase()} ${comboMessage}`;
              winPositions = line.slice(0, consecutive);
            }
          }
        }
      }
    }

    setWinningPositions(winPositions);
    return { message: winMessage, amount: winAmount };
  };

  const calculateJackpot = () => {
    const jackpots = {
      mini: betAmount * 50,
      major: betAmount * 100,
      mega: betAmount * 500
    };
    const random = Math.random();

    if (random < 0.6) return jackpots.mini;
    if (random < 0.9) return jackpots.major;
    return jackpots.mega;
  };

  const handleChestSelection = async (chestId) => {
    if (selectedChests.length >= 3) return;

    const newSelected = [...selectedChests, chestId];
    setSelectedChests(newSelected);

    if (newSelected.length === 3) {
      const rewards = newSelected.map(() => ({
        type: Math.random() < 0.5 ? 'coins' : 'multiplier',
        value: Math.floor(Math.random() * 5) + 1
      }));

      let totalWin = 0;
      rewards.forEach(reward => {
        if (reward.type === 'coins') {
          totalWin += betAmount * reward.value;
        } else {
          setBonusMultiplier(prev => prev * reward.value);
        }
      });

      await updateBalance(totalWin);
      setResult(`Выигрыш: ${totalWin} + множитель x${bonusMultiplier}`);
      setBonusRound(null);
      setSelectedChests([]);
    }
  };

  const countConsecutive = (lineSymbols) => {
    let maxCount = 1;
    let currentCount = 1;
    const baseSymbol = lineSymbols[0].id;

    for (let i = 1; i < lineSymbols.length; i++) {
      if (lineSymbols[i].id === baseSymbol) {
        currentCount++;
        if (currentCount > maxCount) maxCount = currentCount;
      } else {
        break; // Прерываем при первом несовпадении
      }
    }

    return maxCount;
  };

  const isWinningPosition = (col, row) => {
    const position = winningPositions.some(pos => pos.col === col && pos.row === row);
    const comboLength = winningPositions.length;

    return position ? `winning ${comboLength >= 4 ? 'ultra-combo' : ''}` : '';
  };

  const handleBetChange = (amount) => {
    const value = Math.max(1, Math.min(1000, Number(amount) || 1));
    setBetAmount(value);
  };

  const renderBonusRound = () => {
    if (!bonusRound) return null;

    return (
        <div className="bonus-overlay">
          {bonusRound === 'chest' && (
              <>
                <h3>Выберите 3 сундука!</h3>
                <div className="chests-container">
                  {[1, 2, 3, 4, 5].map(id => (
                      <button
                          key={id}
                          onClick={() => handleChestSelection(id)}
                          disabled={selectedChests.includes(id)}
                          className={`chest ${selectedChests.includes(id) ? 'opened' : ''}`}
                      >
                        {selectedChests.includes(id) ? '🎁' : '🎒'}
                      </button>
                  ))}
                </div>
              </>
          )}

          {bonusRound === 'jackpot' && (
              <>
                <h3>🎉 ДЖЕКПОТ! 🎉</h3>
                <div className="jackpot-wheel"></div>
                <button
                    className="spin-btn"
                    onClick={() => {
                      setBonusRound(null);
                      updateBalance(calculateJackpot());
                    }}
                >
                  Получить приз!
                </button>
              </>
          )}
        </div>
    );
  };

  return (
      <div className="slot-machine">
        <BackButton />

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

        <div className="controls">
          <button
              onClick={() => spin()}
              disabled={spinning || isLoading || balance < betAmount || !!bonusRound}
              className="spin-btn"
          >
            {freeSpins > 0 ? `Бесплатные спины: ${freeSpins}` :
                spinning ? 'Крутим...' : `Играть за ${betAmount}`}
          </button>
        </div>

        {result && <div className="result-message">{result}</div>}
        {renderBonusRound()}
        <GameRules />
      </div>
  );
};

export default SlotMachine;