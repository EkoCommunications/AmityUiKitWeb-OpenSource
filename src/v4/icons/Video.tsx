import React from 'react';

// Todo: different icons

export const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
      <path
        d="M16 12L10 8V16L16 12Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Video = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.375 4.375C20.6055 4.375 21.625 5.39453 21.625 6.625V17.875C21.625 19.1406 20.6055 20.125 19.375 20.125H5.875C4.60938 20.125 3.625 19.1406 3.625 17.875V6.625C3.625 5.39453 4.60938 4.375 5.875 4.375H19.375ZM12.5547 6.0625L9.74219 8.875H12.0977L14.9102 6.0625H12.5547ZM5.3125 7.71484V8.875H6.47266L9.28516 6.0625H6.92969L5.3125 7.71484ZM19.9375 17.875V10.5625H5.3125V17.875C5.3125 18.1914 5.55859 18.4375 5.875 18.4375H19.375C19.6562 18.4375 19.9375 18.1914 19.9375 17.875ZM19.9375 6.69531V6.625C19.9375 6.34375 19.6562 6.0625 19.375 6.0625H18.1797L15.3672 8.875H17.7227L19.9375 6.69531ZM11.2891 17.3125C11.2188 17.3125 11.1836 17.3125 11.1133 17.2773C11.0078 17.207 10.9375 17.0664 10.9375 16.9258V12.0742C10.9375 11.9336 11.0078 11.8281 11.1133 11.7578C11.2188 11.6875 11.3945 11.6875 11.5 11.7227L15.2266 14.1484C15.3672 14.2188 15.4375 14.3242 15.4375 14.5C15.4375 14.6406 15.3672 14.7812 15.2617 14.8516L11.5 17.2773C11.4297 17.3125 11.3594 17.3125 11.2891 17.3125Z"
      fill="currentColor"
    />
  </svg>
);