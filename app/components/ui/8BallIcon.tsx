export const EightBallIcon = ({
  color = "#00CDB8",
  size = 35,
}: {
  color?: string;
  size?: number;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="250" cy="250" r="240" stroke={color} stroke-width="20" />
      <path
        d="M54.6499 249.643C66 131.5 140.5 52.643 255.65 52.6431"
        stroke={color}
        stroke-width="17"
        stroke-linecap="round"
      />
      <path
        d="M342 68.0001C373.343 83.2216 386.758 93.6866 403 116"
        stroke={color}
        stroke-width="17"
        stroke-linecap="round"
      />
      <circle cx="257" cy="252" r="106.5" stroke={color} stroke-width="17" />
      <path
        d="M278.786 208C278.786 218.715 269.276 228.5 256.143 228.5C243.01 228.5 233.5 218.715 233.5 208C233.5 197.285 243.01 187.5 256.143 187.5C269.276 187.5 278.786 197.285 278.786 208Z"
        stroke={color}
        stroke-width="20"
      />
      <path
        d="M301.5 271C301.5 293.336 281.957 312.5 256.5 312.5C231.043 312.5 211.5 293.336 211.5 271C211.5 248.664 231.043 229.5 256.5 229.5C281.957 229.5 301.5 248.664 301.5 271Z"
        stroke={color}
        stroke-width="20"
      />
    </svg>
  );
};
