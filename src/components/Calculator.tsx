
import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, Settings as SettingsIcon, History as HistoryIcon } from 'lucide-react';
import Settings from './Settings';
import History, { HistoryEntry } from './History';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForNewValue: boolean;
  memory: number;
}

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operator: null,
    waitingForNewValue: false,
    memory: 0
  });

  const [isScientific, setIsScientific] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [calculatorName, setCalculatorName] = useState('Calculator Pro');
  const [buttonColor, setButtonColor] = useState('#ff9500');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentExpression, setCurrentExpression] = useState('');

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        const operatorMap: { [key: string]: string } = {
          '+': '+',
          '-': '−',
          '*': '×',
          '/': '÷'
        };
        handleOperator(operatorMap[key]);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === '.') {
        handleDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  const handleNumber = (num: string) => {
    setState(prev => ({
      ...prev,
      display: prev.waitingForNewValue || prev.display === '0' 
        ? num 
        : prev.display + num,
      waitingForNewValue: false
    }));
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: inputValue,
        operator: nextOperator,
        waitingForNewValue: true
      }));
      setCurrentExpression(`${inputValue} ${nextOperator}`);
    } else if (state.operator && !state.waitingForNewValue) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, state.operator);
      
      // Add to history
      const expression = `${currentValue} ${state.operator} ${inputValue}`;
      addToHistory(expression, String(newValue));

      setState(prev => ({
        ...prev,
        display: String(newValue),
        previousValue: newValue,
        operator: nextOperator,
        waitingForNewValue: true
      }));
      setCurrentExpression(`${newValue} ${nextOperator}`);
    } else {
      setState(prev => ({
        ...prev,
        operator: nextOperator,
        waitingForNewValue: true
      }));
      setCurrentExpression(`${state.previousValue} ${nextOperator}`);
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue !== null && state.operator) {
      const newValue = calculate(state.previousValue, inputValue, state.operator);
      
      // Add to history
      const expression = `${state.previousValue} ${state.operator} ${inputValue}`;
      addToHistory(expression, String(newValue));
      
      setState(prev => ({
        ...prev,
        display: String(newValue),
        previousValue: null,
        operator: null,
        waitingForNewValue: true
      }));
      setCurrentExpression('');
    }
  };

  const calculate = (firstValue: number, secondValue: number, operator: string): number => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '−':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleClear = () => {
    setState({
      display: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
      memory: state.memory
    });
  };

  const handleBackspace = () => {
    setState(prev => ({
      ...prev,
      display: prev.display.length > 1 ? prev.display.slice(0, -1) : '0'
    }));
  };

  const handleDecimal = () => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        display: '0.',
        waitingForNewValue: false
      }));
    } else if (state.display.indexOf('.') === -1) {
      setState(prev => ({
        ...prev,
        display: prev.display + '.'
      }));
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(state.display) / 100;
    setState(prev => ({
      ...prev,
      display: String(value)
    }));
  };

  const handleScientific = (func: string) => {
    const value = parseFloat(state.display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'inverse':
        result = 1 / value;
        break;
      default:
        result = value;
    }

    setState(prev => ({
      ...prev,
      display: String(result),
      waitingForNewValue: true
    }));
  };

  const handleMemory = (operation: string) => {
    const value = parseFloat(state.display);

    switch (operation) {
      case 'MC':
        setState(prev => ({ ...prev, memory: 0 }));
        break;
      case 'MR':
        setState(prev => ({ ...prev, display: String(prev.memory), waitingForNewValue: true }));
        break;
      case 'M+':
        setState(prev => ({ ...prev, memory: prev.memory + value }));
        break;
      case 'M-':
        setState(prev => ({ ...prev, memory: prev.memory - value }));
        break;
    }
  };

  const formatDisplay = (value: string) => {
    if (value.length > 12) {
      const num = parseFloat(value);
      return num.toExponential(6);
    }
    return value;
  };

  const addToHistory = (expression: string, result: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setState(prev => ({
      ...prev,
      display: entry.result,
      waitingForNewValue: true,
      previousValue: null,
      operator: null
    }));
    setCurrentExpression('');
    setShowHistory(false);
  };

  const getButtonStyle = (type: 'operator' | 'function' | 'number') => {
    if (type === 'operator') {
      return {
        background: `linear-gradient(145deg, ${buttonColor}, ${buttonColor}dd)`,
        color: 'white'
      };
    }
    return {};
  };

  return (
    <div className="max-w-md mx-auto bg-calc-bg p-6 rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalculatorIcon style={{ color: buttonColor }} className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-calc-text-primary">{calculatorName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-lg text-white hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: buttonColor }}
            title="History"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg text-white hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: buttonColor }}
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsScientific(!isScientific)}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: buttonColor }}
          >
            {isScientific ? 'Basic' : 'Scientific'}
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="bg-calc-display rounded-2xl p-6 mb-6 text-right">
        <div className="text-calc-text-secondary text-sm mb-1 min-h-[1em]">
          {currentExpression || (state.operator && state.previousValue !== null && 
            `${state.previousValue} ${state.operator}`)}
        </div>
        <div className="text-calc-text-primary text-4xl font-light min-h-[1.2em] break-all">
          {formatDisplay(state.display)}
        </div>
      </div>

      {/* Scientific Functions (when enabled) */}
      {isScientific && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          <button onClick={() => handleScientific('sin')} className="calc-button-function">sin</button>
          <button onClick={() => handleScientific('cos')} className="calc-button-function">cos</button>
          <button onClick={() => handleScientific('tan')} className="calc-button-function">tan</button>
          <button onClick={() => handleScientific('log')} className="calc-button-function">log</button>
          <button onClick={() => handleScientific('ln')} className="calc-button-function">ln</button>
          <button onClick={() => handleScientific('sqrt')} className="calc-button-function">√</button>
          <button onClick={() => handleScientific('square')} className="calc-button-function">x²</button>
          <button onClick={() => handleScientific('inverse')} className="calc-button-function">1/x</button>
        </div>
      )}

      {/* Memory Functions */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <button onClick={() => handleMemory('MC')} className="calc-button-function">MC</button>
        <button onClick={() => handleMemory('MR')} className="calc-button-function">MR</button>
        <button onClick={() => handleMemory('M+')} className="calc-button-function">M+</button>
        <button onClick={() => handleMemory('M-')} className="calc-button-function">M-</button>
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button onClick={handleClear} className="calc-button-function">C</button>
        <button onClick={handleBackspace} className="calc-button-function">⌫</button>
        <button onClick={handlePercentage} className="calc-button-function">%</button>
        <button 
          onClick={() => handleOperator('÷')} 
          className="calc-button"
          style={getButtonStyle('operator')}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => handleNumber('7')} className="calc-button">7</button>
        <button onClick={() => handleNumber('8')} className="calc-button">8</button>
        <button onClick={() => handleNumber('9')} className="calc-button">9</button>
        <button 
          onClick={() => handleOperator('×')} 
          className="calc-button"
          style={getButtonStyle('operator')}
        >
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => handleNumber('4')} className="calc-button">4</button>
        <button onClick={() => handleNumber('5')} className="calc-button">5</button>
        <button onClick={() => handleNumber('6')} className="calc-button">6</button>
        <button 
          onClick={() => handleOperator('−')} 
          className="calc-button"
          style={getButtonStyle('operator')}
        >
          −
        </button>

        {/* Row 4 */}
        <button onClick={() => handleNumber('1')} className="calc-button">1</button>
        <button onClick={() => handleNumber('2')} className="calc-button">2</button>
        <button onClick={() => handleNumber('3')} className="calc-button">3</button>
        <button 
          onClick={() => handleOperator('+')} 
          className="calc-button"
          style={getButtonStyle('operator')}
        >
          +
        </button>

        {/* Row 5 */}
        <button onClick={() => handleNumber('0')} className="calc-button-zero">0</button>
        <button onClick={handleDecimal} className="calc-button">.</button>
        <button 
          onClick={handleEquals} 
          className="calc-button"
          style={getButtonStyle('operator')}
        >
          =
        </button>
      </div>

      {/* Memory indicator */}
      {state.memory !== 0 && (
        <div className="mt-4 text-center">
          <span className="text-sm font-medium" style={{ color: buttonColor }}>
            Memory: {state.memory}
          </span>
        </div>
      )}

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        calculatorName={calculatorName}
        onNameChange={setCalculatorName}
        buttonColor={buttonColor}
        onColorChange={setButtonColor}
      />

      {/* History Modal */}
      <History
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
};

export default Calculator;
