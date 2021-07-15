import React from 'react';


/**
 * @param {{
 *  size: "small" | "regular" | "medium" | "large",
 *  color: "primary" | "secondary",
 *  onClick: function
 * }} props
 * @returns
 */
function Button(props) {
  return (
    <div onClick={ props.onClick } className={`Button s-${props.size} c-${props.color ?? "primary"}`}>
      {props.children}
    </div>
  )
}

export default Button;