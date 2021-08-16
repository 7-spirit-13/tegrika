import React from 'react';

const Modes = {
  Sec: 1,
  MinSec: 2
};

function with0(num, digits_count=2) {
  const s_num = num.toString();
  return "0".repeat(digits_count - s_num.length).concat(s_num);
}

/**
 * 
 * @param {object} props
 * @param {number} props.to
 * @param {number} mode
 * @returns 
 */
export default function Timer(props) {

  const [timeLeft, setTimeLeft] = React.useState(Math.ceil((props.to - Date.now()) / 1000));
  const mode = props.mode || Modes.Sec;

  React.useLayoutEffect(() => {
    if (timeLeft == 0) return;
    const now = Date.now();
    const _timeLeft = props.to - now;

    let timeout;
    if (_timeLeft % 1000 > 50) {
      timeout = setTimeout(() => setTimeLeft(parseInt(_timeLeft / 1000)), _timeLeft % 1000);
    } else {
      timeout = setTimeout(() => setTimeLeft(parseInt(_timeLeft / 1000) - 1), _timeLeft % 1000 + 1000);
    }
    return () => clearTimeout(timeout);
  }, [timeLeft]);

  return (
    <>
      {mode == Modes.Sec && <>{timeLeft}</>}
      {mode == Modes.MinSec && <>{parseInt(timeLeft / 60)}:{with0(timeLeft % 60, 2)}</>}
    </>
  );
}

Timer.Modes = Modes;