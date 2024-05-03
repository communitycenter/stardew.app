import Head from "next/head";

type WrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  pageKeywords: string[];
};

const GLOBAL_KEYWORDS = [
  "cooking tracker",
  "stardew valley gameplay tracker",
  "stardew valley",
  "stardew checkup",
  "stardew bundles",
  "stardew 100% completion",
  "stardew perfection tracker",
  "stardew",
  "valley",
];

export default function PageWrapper(props: WrapperProps) {
  const keywordString = [...props.pageKeywords, ...GLOBAL_KEYWORDS].join(", ");
  return (
    <>
      <Head>
        <title>stardew.app | Cooking</title>
        <meta name="title" content={`${props.title} | stardew.app`} />
        <meta name="description" content={props.description} />
        <meta name="og:description" content={props.description} />
        <meta name="twitter:description" content={props.description} />
        <meta name="keywords" content={keywordString} />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        {props.children}
      </main>
    </>
  );
}
