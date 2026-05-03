import type { SVGProps } from 'react';

export const YGOIcon = ({ height = 24, width = 24, ...props }: Omit<SVGProps<SVGSVGElement>, 'viewBox'>) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: _
    <svg {...props} fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.53829 6.73913C8.25012 6.19399 8.08696 5.57257 8.08696 4.91304C8.08696 2.75193 9.83889 1 12 1C14.1611 1 15.913 2.75193 15.913 4.91304C15.913 5.57257 15.7499 6.19399 15.4617 6.73913H24L12 22.913L0 6.73913H8.53829ZM13.3302 6.73913H10.6699C10.2846 6.38181 10.0435 5.87123 10.0435 5.30435C10.0435 4.22379 10.9195 3.34783 12 3.34783C13.0806 3.34783 13.9566 4.22379 13.9566 5.30435C13.9566 5.87123 13.7155 6.38181 13.3302 6.73913Z"
        fill="currentColor"
      />
    </svg>
  );
};
