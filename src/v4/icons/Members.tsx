import React from 'react';

export const Members = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 20 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 7C4.0625 7 2.5 5.4375 2.5 3.5C2.5 1.59375 4.0625 0 6 0C7.90625 0 9.5 1.59375 9.5 3.5C9.5 5.4375 7.90625 7 6 7ZM8.375 8C10.375 8 12 9.625 12 11.625V12.5C12 13.3438 11.3125 14 10.5 14H1.5C0.65625 14 0 13.3438 0 12.5V11.625C0 9.625 1.59375 8 3.59375 8H3.84375C4.5 8.3125 5.21875 8.5 6 8.5C6.75 8.5 7.46875 8.3125 8.125 8H8.375ZM15 7C13.3438 7 12 5.65625 12 4C12 2.34375 13.3438 1 15 1C16.6562 1 18 2.34375 18 4C18 5.65625 16.6562 7 15 7ZM16.5 8C18.4062 8 20 9.59375 20 11.5C20 12.3438 19.3125 13 18.5 13H12.9688C12.9688 12.9375 13 12.875 13 12.8125V11.625C13 10.4062 12.5 9.3125 11.75 8.5C12.25 8.1875 12.8438 8 13.5 8H13.5938C14.0312 8.15625 14.5 8.25 15 8.25C15.4688 8.25 15.9375 8.15625 16.375 8H16.5Z"
      fill={props.fill}
    />
  </svg>
);