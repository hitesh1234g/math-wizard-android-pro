
import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';

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
    } else if (state.operator && !state.waitingForNewValue) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, state.operator);

      setState(prev => ({
        ...prev,
        display: String(newValue),
        previousValue: newValue,
        operator: nextOperator,
        waitingForNewValue: true
      }));
    } else {
      setState(prev => ({
        ...prev,
        operator: nextOperator,
        waitingForNewValue: true
      }));
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue !== null && state.operator) {
      const newValue = calculate(state.previousValue, inputValue, state.operator);
      setState(prev => ({
        ...prev,
        display: String(newValue),
        previousValue: null,
        operator: null,
        waitingForNewValue: true
      }));
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

  return (
    <div className="max-w-md mx-auto bg-calc-bg p-6 rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalculatorIcon className="text-primary w-8 h-8" />
          <h1 className="text-xl font-semibold text-calc-text-primary">Calculator Pro</h1>
        </div>
        <button
          onClick={() => setIsScientific(!isScientific)}
          className="px-4 py-2 rounded-lg bg-calc-btn-function text-white text-sm font-medium hover:bg-opacity-80 transition-colors"
        >
          {isScientific ? 'Basic' : 'Scientific'}
        </button>
      </div>

      {/* Display */}
      <div className="bg-calc-display rounded-2xl p-6 mb-6 text-right">
        <div className="text-calc-text-secondary text-sm mb-1">
          {state.operator && state.previousValue !== null && 
            `${state.previousValue} ${state.operator}`}
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
        <button onClick={() => handleOperator('÷')} className="calc-button-operator">÷</button>

        {/* Row 2 */}
        <button onClick={() => handleNumber('7')} className="calc-button">7</button>
        <button onClick={() => handleNumber('8')} className="calc-button">8</button>
        <button onClick={() => handleNumber('9')} className="calc-button">9</button>
        <button onClick={() => handleOperator('×')} className="calc-button-operator">×</button>

        {/* Row 3 */}
        <button onClick={() => handleNumber('4')} className="calc-button">4</button>
        <button onClick={() => handleNumber('5')} className="calc-button">5</button>
        <button onClick={() => handleNumber('6')} className="calc-button">6</button>
        <button onClick={() => handleOperator('−')} className="calc-button-operator">−</button>

        {/* Row 4 */}
        <button onClick={() => handleNumber('1')} className="calc-button">1</button>
        <button onClick={() => handleNumber('2')} className="calc-button">2</button>
        <button onClick={() => handleNumber('3')} className="calc-button">3</button>
        <button onClick={() => handleOperator('+')} className="calc-button-operator">+</button>

        {/* Row 5 */}
        <button onClick={() => handleNumber('0')} className="calc-button-zero">0</button>
        <button onClick={handleDecimal} className="calc-button">.</button>
        <button onClick={handleEquals} className="calc-button-operator">=</button>
      </div>

      {/* Memory indicator */}
      {state.memory !== 0 && (
        <div className="mt-4 text-center">
          <span className="text-primary text-sm font-medium">
            Memory: {state.memory}
          </span>
        </div>
      )}
    </div>
  );
};

export default Calculator;
