import React, { useState } from 'react';
import './GameRules.css';
import seven from '../../../assets/slot/7.svg';
import eight from '../../../assets/slot/8.svg';
import nine from '../../../assets/slot/9.svg';
import ten from '../../../assets/slot/10.svg';
import jack from '../../../assets/slot/j.svg';
import queen from '../../../assets/slot/q.svg';
import wild from '../../../assets/slot/wild.gif';
import scatter from '../../../assets/slot/scatter.gif';
import bonus from '../../../assets/slot/bonus.gif';
import multiplier from '../../../assets/slot/multiplier.gif';

const symbolIcons = {
    '7': seven,
    '8': eight,
    '9': nine,
    '10': ten,
    'j': jack,
    'q': queen,
    'wild': wild,
    'scatter': scatter,
    'bonus': bonus,
    'multiplier': multiplier
};

const GameRules = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="game-rules-container">
            <button
                className={`rules-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '▲ Скрыть правила' : '▼ Показать правила игры'}
            </button>

            <div className={`rules-content ${isOpen ? 'open' : ''}`}>
                <h3 className="rules-title">🎰 Правила игры</h3>

                <ul className="rules-list">
                    <li className="rule-item">
                        <div className="symbol-group">
                            <img src={symbolIcons['7']} alt="7" className="rule-icon" />
                            <img src={symbolIcons['8']} alt="8" className="rule-icon" />
                            <img src={symbolIcons['9']} alt="9" className="rule-icon" />
                        </div>
                        <span className="rule-text">3+ одинаковых символа в линии - выигрыш</span>
                    </li>

                    <li className="rule-item">
                        <img src={symbolIcons['wild']} alt="Wild" className="rule-icon" />
                        <span className="rule-text">Wild заменяет обычные символы</span>
                    </li>

                    <li className="rule-item">
                        <div className="symbol-group">
                            <img src={symbolIcons['bonus']} alt="Bonus" className="rule-icon" />
                            <img src={symbolIcons['bonus']} alt="Bonus" className="rule-icon" />
                            <img src={symbolIcons['bonus']} alt="Bonus" className="rule-icon" />
                        </div>
                        <span className="rule-text"> - бонусный раунд с сундуками</span>
                    </li>

                    <li className="rule-item">
                        <div className="symbol-group">
                            <img src={symbolIcons['bonus']} alt="Bonus" className="rule-icon" />
                            <span className="bonus-count">x4</span>
                        </div>
                        <span className="rule-text"> - 10 бесплатных спинов</span>
                    </li>

                    <li className="rule-item">
                        <div className="symbol-group">
                            <img src={symbolIcons['bonus']} alt="Bonus" className="rule-icon" />
                            <span className="bonus-count">x5</span>
                        </div>
                        <span className="rule-text"> - прогрессивный джекпот</span>
                    </li>

                    <li className="rule-item">
                        <img src={symbolIcons['multiplier']} alt="Multiplier" className="rule-icon" />
                        <span className="rule-text">Увеличивает выигрыши ×2-×5</span>
                    </li>

                    <li className="rule-item">
                        <img src={symbolIcons['scatter']} alt="Scatter" className="rule-icon" />
                        <span className="rule-text">3+ символа = фриспины</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GameRules;