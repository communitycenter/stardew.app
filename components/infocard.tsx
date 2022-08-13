import { SVGProps } from "react";

interface Props {
  title: string;
  description?: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

const InfoCard = ({ title, Icon, description }: Props) => {
  return (
    <div className="flex items-center space-x-3 truncate rounded-lg border border-gray-300 bg-[#f0f0f0] py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#191919]">
      <Icon className="h-6 w-6 dark:text-white" />
      <div className="min-w-0 flex-1">
        <p
          className={
            "truncate text-sm text-gray-900 dark:text-white" +
            (description ? " font-semibold" : " font-medium")
          }
        >
          {title}
        </p>
        {description ? (
          <p className="truncate text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InfoCard;
