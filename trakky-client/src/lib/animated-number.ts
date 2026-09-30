import AnimatedNumberModule from 'animated-number-react';

// animated-number-react is CJS. Vite 8 (rolldown) leaves its default export as
// the module namespace ({ __esModule, default }) instead of unwrapping it, so
// unwrap here; the fallback keeps it working if a bundler already unwraps.
const AnimatedNumber =
  (AnimatedNumberModule as { default?: typeof AnimatedNumberModule }).default ??
  AnimatedNumberModule;

export default AnimatedNumber;
