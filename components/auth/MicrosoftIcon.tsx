import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MicrosoftIcon = ({
size = 24,
className = ""
}) => {
  return (
    <Svg className={className} viewBox="0 0 23 23" width={size} height={size}><Path fill="#00000000" d="M0 0h23v23H0z"/><Path fill="#f35325" d="M1 1h10v10H1z"/><Path fill="#81bc06" d="M12 1h10v10H12z"/><Path fill="#05a6f0" d="M1 12h10v10H1z"/><Path fill="#ffba08" d="M12 12h10v10H12z"/></Svg>);
};

export default MicrosoftIcon;