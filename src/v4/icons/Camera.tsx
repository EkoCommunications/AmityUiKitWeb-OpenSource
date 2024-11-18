import React from 'react';

export const Camera = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M28.5 11.5356V25.0356C28.5 26.3013 27.4688 27.2856 26.25 27.2856H6.75C5.48438 27.2856 4.5 26.3013 4.5 25.0356V11.5356C4.5 10.3169 5.48438 9.28564 6.75 9.28564H10.875L11.4375 7.78564C11.7656 6.89502 12.6094 6.28564 13.5469 6.28564H19.4062C20.3438 6.28564 21.1875 6.89502 21.5156 7.78564L22.125 9.28564H26.25C27.4688 9.28564 28.5 10.3169 28.5 11.5356ZM22.125 18.2856C22.125 15.1919 19.5938 12.6606 16.5 12.6606C13.3594 12.6606 10.875 15.1919 10.875 18.2856C10.875 21.4263 13.3594 23.9106 16.5 23.9106C19.5938 23.9106 22.125 21.4263 22.125 18.2856ZM20.625 18.2856C20.625 20.5825 18.75 22.4106 16.5 22.4106C14.2031 22.4106 12.375 20.5825 12.375 18.2856C12.375 16.0356 14.2031 14.1606 16.5 14.1606C18.75 14.1606 20.625 16.0356 20.625 18.2856Z"
        fill="white"
        fill-opacity="0.8"
      />
    </svg>
  );
};
