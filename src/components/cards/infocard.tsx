import { SVGProps } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  title: string;
  description?: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const InfoCard = ({ title, Icon, description }: Props) => {
  return (
    <Card className="truncate rounded-lg bg-[#f0f0f0] ">
      <CardHeader>
        {Icon && <Icon className="h-6 w-6 dark:text-white" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
