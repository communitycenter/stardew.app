import Image from "next/image";

interface Props {
  skill: string;
  level: number;
  iconURL: string;
}

const SkillDisplay = ({ skill, level, iconURL }: Props) => {
  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <Image src={iconURL} alt={skill + " Skill Icon"} width={24} height={24} />
      <p>
        {skill} Level: {level}
      </p>
    </div>
  );
};

export default SkillDisplay;
