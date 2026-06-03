interface FlowerLogoProps {
  size?: number;
  color?: string;
  centerColor?: string;
}

export default function FlowerLogo({
  size = 58,
  color = '#1A7D8A',
  centerColor = 'white',
}: FlowerLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 85 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="42.5" cy="26.5" r="18" fill={color} />
      <circle cx="57.7" cy="37.7" r="18" fill={color} />
      <circle cx="51.6" cy="55.6" r="18" fill={color} />
      <circle cx="33.4" cy="55.6" r="18" fill={color} />
      <circle cx="27.3" cy="37.7" r="18" fill={color} />
      <circle cx="42.5" cy="42.5" r="11" fill={centerColor} />
    </svg>
  );
}
