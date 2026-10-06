import AnimatedNumberModule from 'animated-number-react';

// Vite 8 (rolldown) leaves this CJS module's default export wrapped in its namespace object.
const AnimatedNumber =
  (AnimatedNumberModule as { default?: typeof AnimatedNumberModule }).default ??
  AnimatedNumberModule;

export default AnimatedNumber;
