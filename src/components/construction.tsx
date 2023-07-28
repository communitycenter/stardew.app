import Image from "next/image";

export const Construction = () => {
  return (
    <div className="block sm:flex space-x-4 items-center justify-center">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
        This page is under construction, please check back later!
      </h1>
      <div className="flex justify-center">
        <Image
          src="/construction.gif"
          alt="Robin GIF"
          width={64}
          height={128}
          quality={100}
        />
      </div>
    </div>
  );
};
