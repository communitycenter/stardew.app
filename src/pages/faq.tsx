import { QuestionCard } from "@/components/cards/question-card";
import { IconPencil } from "@tabler/icons-react";
import Head from "next/head";

const faq = [
  {
    question: "Can I edit my saves with stardew.app?",
    answer:
      "stardew.app is a perfection checklist, not a save file editor. While we allow you to upload your save files to the site, we do not store any more data than is needed to update you on your perfection status. We do not store your save file after upload and unfortunately cannot retrieve it for you.",
    icon: IconPencil,
  },
  {
    question: "How do I upload my save file?",
    answer:
      "To upload your save file, click on the 'Upload Save' button on the homepage. You will be prompted to select your save file from your computer. Once you have selected your save file, you will be able to see your progress on the homepage.",
    icon: IconPencil,
  },
  {
    question: "Can I track multiple save files?",
    answer:
      "Yes! You can track multiple save files by uploading each save file separately. You can switch between save files by clicking on the 'Switch Save' button on the homepage.",
    icon: IconPencil,
  },
];

export default function FAQ() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="og:description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="twitter:description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="keywords"
          content="stardew valley bundle tracker, stardew valley community center bundles, stardew valley bundle items, stardew valley bundle progress, stardew valley community center restoration, stardew valley gameplay tracker, stardew valley, stardew, bundle tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions about stardew.app!
          </h1>
          <div className="columns-3 gap-8">
            {faq.map((item, index) => (
              <QuestionCard
                key={index}
                question={item.question}
                answer={item.answer}
                Icon={item.icon}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
