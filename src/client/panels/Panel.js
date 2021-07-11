import React from 'react';

/**
 * @param {string} name name of the panel
 * @param {React.Component} component React component
 */
export function Panel(name, component) {
  this.name = name;
  this.component = component;
}