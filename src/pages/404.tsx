import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Link href={"/"}>
      <main
        className={`flex min-h-screen flex-col items-center justify-center px-5 pb-8 pt-2 md:px-8`}
      >
        <div className="flex flex-col justify-center ">
          <Image src="/404.png" alt="404" width={960} height={540} />
          {/* <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
          This page is under construction, please check back later!
        </h1> */}
        </div>
      </main>
    </Link>
  );
}
