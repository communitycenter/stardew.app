import * as RawBundles from "../../research/processors/bundles.json";

const BundleCard = ({ bundle }: Props) => {
  <div className="relative space-y-2 rounded-lg bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
    <div className="text-gray-900 dark:text-white">Vault</div>
    <div className="grid grid-cols-2 gap-2">
      <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8"
            src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
            alt="wtf"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Gold
          </p>
          <p className="truncate text-sm text-gray-400">2,500g</p>
        </div>
      </div>
      <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8"
            src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
            alt="wtf"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Gold
          </p>
          <p className="truncate text-sm text-gray-400">5,000g</p>
        </div>
      </div>
      <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8"
            src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
            alt="wtf"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Gold
          </p>
          <p className="truncate text-sm text-gray-400">10,000g</p>
        </div>
      </div>
      <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8"
            src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
            alt="wtf"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Gold
          </p>
          <p className="truncate text-sm text-gray-400">25,000g</p>
        </div>
      </div>
    </div>
  </div>;
};

export default BundleCard;
