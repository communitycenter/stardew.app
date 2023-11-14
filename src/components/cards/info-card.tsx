import Image from "next/image";

interface Props {
  title: string;
  description?: string;
  Icon?: any;
  sourceURL?: string;
  children?: React.ReactNode;
}

export const InfoCard = ({
  title,
  Icon,
  description,
  sourceURL,
  children,
}: Props) => {
  return (
    <div className="flex items-center space-x-3 truncate rounded-lg border-none border-neutral-200 bg-white py-4 px-5 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 shadow-none">
      {Icon && <Icon className="h-6 w-6 dark:text-white" />}
      {sourceURL && (
        <Image
          src={sourceURL}
          alt={title}
          width={36}
          height={36}
          className="rounded-sm"
          quality={25}
        />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={
            "truncate text-sm" +
            (description ? " font-semibold" : " font-medium")
          }
        >
          {title}
        </p>
        {description ? (
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        ) : null}
        {children && <div className="mt-1 ">{children}</div>}
      </div>
    </div>
  );
};
