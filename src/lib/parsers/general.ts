function msToTime(time: number): string {
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}
/* ---------------------------- stardrops parser ---------------------------- */
interface StardropsRet {
  stardrops: string[];
}

const STARDROPS = new Set<string>([
  "CF_Fair",
  "CF_Fish",
  "CF_Mines",
  "CF_Sewer",
  "CF_Spouse",
  "CF_Statue",
  "museumComplete",
]);

function parseStardrops(player: any): StardropsRet {
  /*
    Achievements Relevant:
      - Mystery Of The Stardrops (find every stardrop).
  */
  try {
    let stardrops: string[] = [];

    // look through the player's mail for the stardrops
    if (!player.mailReceived || typeof player.mailReceived === "undefined") {
      return { stardrops };
    }

    if (Array.isArray(player.mailReceived.string)) {
      for (const idx in player.mailReceived.string) {
        let mail = player.mailReceived.string[idx];

        if (STARDROPS.has(mail)) stardrops.push(mail);

        // early return if all stardrops are found
        if (stardrops.length === Object.keys(STARDROPS).length) {
          return { stardrops };
        }
      }
    } else {
      // only one mail received
      if (STARDROPS.has(player.mailReceived.string))
        stardrops.push(player.mailReceived.string);
    }

    return { stardrops };
  } catch (error) {
    throw error;
  }
}

/* ------------------------------ skills parser ----------------------------- */
type Skill = "farming" | "fishing" | "foraging" | "mining" | "combat" | "luck";
interface SkillsRet {
  skills: Record<Skill, number>;
}

function parseSkills(player: any): SkillsRet {
  /*
    Achievements Relevant:
      - Singular Talent (level 10 in at least one skill).
      - Master of the Five Ways (level 10 in every skill).
  */
  try {
    // formula for player level is (farmingLevel + fishingLevel + foragingLevel + miningLevel + combatLevel + luckLevel) / 2
    // as we loop through the levels, we can check if the level is 10 and increment maxLevelCount
    // let maxLevelCount = 0;
    // const playerLevel = Math.floor(
    //   skillLevels.reduce((prev, curr) => {
    //     if (curr === 10) maxLevelCount++;
    //     return prev + curr;
    //   }, 0) / 2
    // );

    const skills = {
      farming: player.farmingLevel,
      fishing: player.fishingLevel,
      foraging: player.foragingLevel,
      mining: player.miningLevel,
      combat: player.combatLevel,
      luck: player.luckLevel, // unused as of 1.5
    };

    return { skills };
  } catch (error) {
    throw error;
  }
}

/* ---------------------------- experience parser ---------------------------- */
interface ExperienceRet {
  experience: Record<Skill, number>;
}

function parseExperience(player: any): ExperienceRet {
  // experiencePoints are stored as an array of 6 numbers, but not actually marked
  // in order of farming, fishing, foraging, mining, combat, luck
  // luck is unused but we'll still parse and return it for completeness

  const experiencePointsArray = player.experiencePoints.int;

  const experience = {
    farming: experiencePointsArray[0],
    fishing: experiencePointsArray[1],
    foraging: experiencePointsArray[2],
    mining: experiencePointsArray[3],
    combat: experiencePointsArray[4],
    luck: experiencePointsArray[5],
  };

  return { experience };
}

/* ----------------------------- general parser ----------------------------- */
const farmTypes = [
  "Standard",
  "Riverland",
  "Forest",
  "Hill-top",
  "Wilderness",
  "Four Corners",
  "Beach",
  "Meadowlands",
];

export interface GeneralRet {
  name?: string;
  timePlayed?: string;
  farmInfo?: string;
  totalMoneyEarned?: number;
  skills?: Record<Skill, number>;
  questsCompleted?: number;
  stardrops?: string[];
  experience?: Record<Skill, number>;
}

export function parseGeneral(player: any, whichFarm: string): GeneralRet {
  try {
    const { name, totalMoneyEarned, millisecondsPlayed, farmName } = player;
    const timePlayed = msToTime(millisecondsPlayed);
    const questsCompleted = player.stats.questsCompleted;

    let farmIdx = 0;

    if (whichFarm === "MeadowlandsFarm") farmIdx = 7;
    else farmIdx = parseInt(whichFarm);

    const farmInfo = `${farmName} Farm (${
      farmTypes[farmIdx % farmTypes.length]
    })`;

    const { skills } = parseSkills(player);
    const { stardrops } = parseStardrops(player);
    const { experience } = parseExperience(player);

    return {
      name,
      timePlayed,
      farmInfo,
      totalMoneyEarned,
      skills,
      questsCompleted,
      stardrops,
      experience,
    };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseGeneral: ${e.message}`);
    else throw new Error(`Error in parseGeneral: ${e}`);
  }
}
