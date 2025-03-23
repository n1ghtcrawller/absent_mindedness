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

  // Остальные функции (checkWin, calculateJackpot, handleChestSelection, countConsecutive, isWinningPosition, handleBetChange, renderBonusRound) остаются без изменений

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
                disabled={spinning || isLoading || isUpdatingBalance}
                className="bet-input"
            />
            <div className="quick-bets">
              {[1, 2, 5].map((amount) => (
                  <button
                      key={amount}
                      onClick={() => handleBetChange(amount)}
                      disabled={spinning || isLoading || isUpdatingBalance}
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
              disabled={
                  spinning ||
                  isLoading ||
                  balance < betAmount ||
                  !!bonusRound ||
                  isUpdatingBalance
              }
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