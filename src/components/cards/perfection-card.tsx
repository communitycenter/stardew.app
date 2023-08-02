import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PercentageIndicator } from "@/components/percentage";

interface Props {
  title: string;
  description: string;
  percentage: number;
  footer: string;
}

export const PerfectionCard = ({
  title,
  description,
  percentage,
  footer,
}: Props) => {
  return (
    <Card>
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <CardHeader className="flex flex-row items-cnter justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{description}</p>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
              {footer}
            </p>
          </CardContent>
        </div>
        <div className="flex justify-end p-5">
          <PercentageIndicator percentage={percentage} />
        </div>
      </div>
    </Card>
  );
};
