import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const BackArrow: React.FC<Props> = (props) => (
<svg 
width="18"
height="15" 
viewBox="0 0 18 15" 
fill="none" 
xmlns="http://www.w3.org/2000/svg"
{...props}>    
<g clipPath="url(#clip0_6_954)">
<path d="M7 4V0L0 7L7 14V9.9C12 9.9 15.5 11.5 18 15C17 10 14 5 7 4Z" fill="#A1A1AA"/>
</g>
<defs>
<clipPath id="clip0_6_954">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

);

export default BackArrow;


