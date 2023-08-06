interface Props {
  percentage: number;
  className: string;
}

export const PercentageIndicator = ({ percentage, className }: Props) => {
  return (
    <svg viewBox="0 0 36 36" className={className}>
      <path
        className="stroke-neutral-200 dark:stroke-neutral-800 fill-none block"
        strokeLinecap="round"
        strokeWidth="3"
        strokeDasharray="100, 100"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="stroke-emerald-500 fill-none animate-progress"
        strokeLinecap="round"
        strokeWidth="3"
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text
        textAnchor="middle"
        x="18.5"
        y="21"
        className="font-semibold fill-neutral-600 dark:fill-white/80 text-[0.5em] -m-1"
      >{`${percentage}%`}</text>
    </svg>
  );
};
