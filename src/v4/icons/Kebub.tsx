import React from 'react';

const Kebub = ({ fill = '#A5A9B5', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <path
      d="M10 8.78369C10.8125 8.78369 11.5 9.47119 11.5 10.2837C11.5 11.1274 10.8125 11.7837 10 11.7837C9.15625 11.7837 8.5 11.1274 8.5 10.2837C8.5 9.47119 9.15625 8.78369 10 8.78369ZM8.5 5.53369C8.5 4.72119 9.15625 4.03369 10 4.03369C10.8125 4.03369 11.5 4.72119 11.5 5.53369C11.5 6.37744 10.8125 7.03369 10 7.03369C9.15625 7.03369 8.5 6.37744 8.5 5.53369ZM8.5 15.0337C8.5 14.2212 9.15625 13.5337 10 13.5337C10.8125 13.5337 11.5 14.2212 11.5 15.0337C11.5 15.8774 10.8125 16.5337 10 16.5337C9.15625 16.5337 8.5 15.8774 8.5 15.0337Z"
      fill={fill}
    />
  </svg>
);

export default Kebub;