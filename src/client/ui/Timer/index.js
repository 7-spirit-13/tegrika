import React from 'react';

/**
 * 
 * @param {object} props
 * @param {number} props.to
 * @param {React.FunctionComponent} props.wrapper
 * @returns 
 */
export default function Timer(props) {
  const Wrapper = props.wrapper || (({children}) => <>{children}</>);

  const [timeLeft, setTimeLeft] = React.useState(Math.ceil((props.to - Date.now()) / 1000));

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
    <Wrapper>{timeLeft}</Wrapper>
  );
}