import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Link href={"/"}>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8 justify-center items-center`}
      >
        <div className="flex justify-center flex-col ">
          <Image src="/404.png" alt="404" width={960} height={540} />
          {/* <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
          This page is under construction, please check back later!
        </h1> */}
        </div>
      </main>
    </Link>
  );
}
