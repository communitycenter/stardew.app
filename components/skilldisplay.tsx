import Image from "next/image";
import { useKV } from "../hooks/useKV";

interface Props {
  skill: string;
  iconURL: string;
}

const SkillDisplay = ({ skill, iconURL }: Props) => {
  const [level] = useKV("levels", skill.toLowerCase(), 0);
  return (
    <div className="flex items-center space-x-3 truncate rounded-lg border border-gray-300 bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <Image
        src={iconURL}
        alt={skill + " Skill Icon"}
        width={42}
        height={42}
        className="rounded-sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-white">
          {skill}
        </p>
        <p className="truncate text-sm text-gray-400">Level {level}</p>
      </div>
    </div>
  );
};

export default SkillDisplay;
