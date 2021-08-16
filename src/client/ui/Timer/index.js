import React from 'react';

const Modes = {
  Sec: 1,
  MinSec: 2
};

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
      {mode == Modes.MinSec && <>{parseInt(timeLeft / 60)}:{timeLeft % 60}</>}
    </>
  );
}

Timer.Modes = Modes;