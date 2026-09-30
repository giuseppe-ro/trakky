/// <reference types="vite/client" />

declare module 'animated-number-react' {
  import { ComponentClass } from 'react';

  export interface AnimatedNumberProps {
    value: number;
    formatValue?: (v: number) => string;
  }
  const AnimatedNumber: ComponentClass<AnimatedNumberProps>;
  export default AnimatedNumber;
}
