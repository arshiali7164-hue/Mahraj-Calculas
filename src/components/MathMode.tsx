import { useState } from 'react';

export function MathMode() {
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [isRad, setIsRad] = useState(false);
  const [isSciNotation, setIsSciNotation] = useState(false);

  const formatForDisplay = (numStr: string, isActiveInput: boolean = false) => {
    if (numStr === 'NaN' || numStr === 'Infinity' || numStr === '-Infinity') return 'Error';
    
    const num = Number(numStr);
    if (!isNaN(num)) {
      if (isSciNotation && !isActiveInput) {
        return parseFloat(num.toPrecision(10)).toExponential();
      }
      if (numStr.length > 12) {
        // Prevent expanding long numbers from taking too much space
        return String(parseFloat(num.toPrecision(10)));
      }
    }
    return numStr;
  };

  const handleNum = (num: string) => {
    if (current === 'Error') {
      setCurrent(num);
      setWaitingForNewValue(false);
      return;
    }
    if (waitingForNewValue) {
      setCurrent(num);
      setWaitingForNewValue(false);
    } else {
      setCurrent(current === '0' ? num : current + num);
    }
  };

  const handleDot = () => {
    if (current === 'Error') {
      setCurrent('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (waitingForNewValue) {
      setCurrent('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  };

  const handleClear = () => {
    if (current === 'Error' || (current === '0' && previous === null)) {
      setCurrent('0');
      setPrevious(null);
      setOperator(null);
      setWaitingForNewValue(false);
    } else {
      setCurrent('0');
    }
  };

  const handleToggleSign = () => {
    if (current === '0' || current === 'Error') return;
    setCurrent(current.startsWith('-') ? current.slice(1) : '-' + current);
  };

  const handlePercent = () => {
    if (current === 'Error') return;
    const val = parseFloat(current);
    setCurrent(String(val / 100));
    setWaitingForNewValue(true);
  };

  const calculate = (a: number, b: number, op: string) => {
    let res = 0;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b === 0 ? NaN : a / b; break;
      case '^': res = Math.pow(a, b); break;
      default: res = b;
    }
    // Mitigate 0.1 + 0.2 = 0.30000000000000004 issues
    return Math.round(res * 1e12) / 1e12;
  };

  const handleOperator = (op: string) => {
    if (current === 'Error') return;
    if (operator && previous && !waitingForNewValue) {
      const result = calculate(parseFloat(previous), parseFloat(current), operator);
      setCurrent(String(result));
      setPrevious(String(result));
    } else {
      setPrevious(current);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEquals = () => {
    if (current === 'Error') return;
    if (operator && previous) {
      const result = calculate(parseFloat(previous), parseFloat(current), operator);
      setCurrent(String(result));
      setPrevious(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleScientific = (func: string) => {
    if (current === 'Error') return;
    const val = parseFloat(current);
    let result = 0;

    let angle = val;
    if (!isRad && ['sin', 'cos', 'tan'].includes(func)) {
      angle = val * (Math.PI / 180);
    }

    switch (func) {
      case 'sin': result = Math.sin(angle); break;
      case 'cos': result = Math.cos(angle); break;
      case 'tan': 
        if (!isRad && val % 180 === 90) result = NaN;
        else result = Math.tan(angle); 
        break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case '√': result = val < 0 ? NaN : Math.sqrt(val); break;
      case 'π': 
        setCurrent(String(waitingForNewValue || current === '0' ? Math.PI : val * Math.PI));
        setWaitingForNewValue(true);
        return;
      case 'e':
        setCurrent(String(waitingForNewValue || current === '0' ? Math.E : val * Math.E));
        setWaitingForNewValue(true);
        return;
    }
    
    result = Math.round(result * 1e12) / 1e12;
    setCurrent(String(result));
    setWaitingForNewValue(true);
  };

  const displayValue = formatForDisplay(current, !waitingForNewValue);

  const btnBase = "h-12 sm:h-14 rounded-xl text-lg sm:text-xl font-mono font-medium transition-all focus:outline-none flex items-center justify-center active:scale-95 border border-transparent shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.05)] select-none touch-manipulation";
  const btnNu = `${btnBase} bg-zinc-900/80 hover:bg-zinc-800 text-green-100 hover:border-lime-500/30`;
  const btnOp = `${btnBase} bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 hover:border-lime-500/50`;
  const btnOpActive = `${btnBase} bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]`;
  const btnFn = `${btnBase} bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white`;
  const btnSci = `${btnBase} bg-zinc-800/40 text-cyan-400 hover:bg-zinc-700/60 hover:text-cyan-300 text-sm`;

  return (
    <div className="flex-1 flex flex-col justify-end p-4 relative z-10 w-full h-full">
      <div className="flex flex-col items-end justify-end mb-4 flex-1 relative">
        <div className="absolute top-2 left-0 flex gap-2">
          <button 
            onClick={() => setIsRad(!isRad)}
            className="bg-zinc-800/50 text-zinc-400 hover:text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest transition-colors border border-zinc-700/50"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <button 
            onClick={() => setIsSciNotation(!isSciNotation)}
            className={`px-3 py-1 rounded-lg text-xs font-bold tracking-widest transition-colors border ${isSciNotation ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-white border-zinc-700/50'}`}
          >
            SCI
          </button>
        </div>
        <div className="text-lime-500/70 text-xl font-mono h-8 mb-2 flex gap-3">
          {previous && <span>{formatForDisplay(previous, false)}</span>}
          {operator && <span className="text-lime-400">{operator}</span>}
        </div>
        <div 
          className="text-white text-5xl sm:text-6xl font-mono tracking-tighter truncate w-full text-right drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-100"
          style={{ fontSize: displayValue.length > 8 ? '2rem' : '' }}
        >
          {displayValue}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Scientific Row 1 */}
        <button className={btnSci} onClick={() => handleScientific('sin')}>sin</button>
        <button className={btnSci} onClick={() => handleScientific('cos')}>cos</button>
        <button className={btnSci} onClick={() => handleScientific('tan')}>tan</button>
        <button className={btnSci} onClick={() => handleScientific('√')}>√</button>

        {/* Scientific Row 2 */}
        <button className={btnSci} onClick={() => handleScientific('log')}>log</button>
        <button className={btnSci} onClick={() => handleScientific('ln')}>ln</button>
        <button className={btnSci} onClick={() => handleScientific('π')}>π</button>
        <button className={operator === '^' && waitingForNewValue ? btnOpActive : btnSci} onClick={() => handleOperator('^')}>xʸ</button>

        {/* Standard Calc */}
        <button className={btnFn} onClick={handleClear}>
          {current === '0' && previous === null ? 'AC' : 'C'}
        </button>
        <button className={btnFn} onClick={handleToggleSign}>+/-</button>
        <button className={btnFn} onClick={handlePercent}>%</button>
        <button className={operator === '÷' && waitingForNewValue ? btnOpActive : btnOp} onClick={() => handleOperator('÷')}>÷</button>

        <button className={btnNu} onClick={() => handleNum('7')}>7</button>
        <button className={btnNu} onClick={() => handleNum('8')}>8</button>
        <button className={btnNu} onClick={() => handleNum('9')}>9</button>
        <button className={operator === '×' && waitingForNewValue ? btnOpActive : btnOp} onClick={() => handleOperator('×')}>×</button>

        <button className={btnNu} onClick={() => handleNum('4')}>4</button>
        <button className={btnNu} onClick={() => handleNum('5')}>5</button>
        <button className={btnNu} onClick={() => handleNum('6')}>6</button>
        <button className={operator === '-' && waitingForNewValue ? btnOpActive : btnOp} onClick={() => handleOperator('-')}>-</button>

        <button className={btnNu} onClick={() => handleNum('1')}>1</button>
        <button className={btnNu} onClick={() => handleNum('2')}>2</button>
        <button className={btnNu} onClick={() => handleNum('3')}>3</button>
        <button className={operator === '+' && waitingForNewValue ? btnOpActive : btnOp} onClick={() => handleOperator('+')}>+</button>

        <button className={`${btnNu} col-span-2 justify-start pl-6`} onClick={() => handleNum('0')}>
          0
        </button>
        <button className={btnNu} onClick={handleDot}>.</button>
        <button className={btnOp} onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}
