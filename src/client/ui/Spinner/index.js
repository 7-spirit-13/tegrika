import React from 'react';

import { Icon24Spinner, Icon32Spinner, Icon44Spinner, Icon16Spinner } from '@vkontakte/icons';

const svgSpinner = ({ size }) => {
  switch (size) {
    case 'large':
      return <Icon44Spinner className="Spinner__self" />;
    case 'medium':
      return <Icon32Spinner className="Spinner__self" />;
    case 'small':
      return <Icon16Spinner className="Spinner__self" />;
    default:
      return <Icon24Spinner className="Spinner__self" />;
  }
}

/**
 * @param {{
 *  size: "small" | "regular" | "large" | "medium"
 * }} props
 */
function Spinner(props) {
  return (
    <div className="Spinner">
      { svgSpinner(props) }
    </div>
  )
}

export default React.memo(Spinner);