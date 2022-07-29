import { SVGProps } from "react";

interface Props {
  title: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

const InfoCard = ({ title, Icon }: Props) => {
  return (
    <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <Icon className="h-5 w-5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
