import { GetStatValue, isPlayerFormatUpdated } from "../utils";

function msToTime(time: number): string {
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}
/* ---------------------------- stardrops parser ---------------------------- */
type Stardrops = Stardrop[];

type Stardrop =
  | "CF_Fair"
  | "CF_Fish"
  | "CF_Mines"
  | "CF_Sewer"
  | "CF_Spouse"
  | "CF_Statue"
  | "museumComplete";
const STARDROPS = new Set<Stardrop>([
  "CF_Fair",
  "CF_Fish",
  "CF_Mines",
  "CF_Sewer",
  "CF_Spouse",
  "CF_Statue",
  "museumComplete",
]);

function parseStardrops(player: any): Stardrops {
  /*
    Achievements Relevant:
      - Mystery Of The Stardrops (find every stardrop).
  */
  try {
    let stardrops: Stardrop[] = [];

    // look through the player's mail for the stardrops
    if (!player.mailReceived || typeof player.mailReceived === "undefined") {
      return stardrops;
    }

    if (Array.isArray(player.mailReceived.string)) {
      for (const idx in player.mailReceived.string) {
        let mail = player.mailReceived.string[idx];

        if (STARDROPS.has(mail)) stardrops.push(mail);

        // early return if all stardrops are found
        if (stardrops.length === STARDROPS.size) return stardrops;
      }
    } else {
      // only one mail received
      if (STARDROPS.has(player.mailReceived.string))
        stardrops.push(player.mailReceived.string);
    }

    return stardrops;
  } catch (error) {
    throw error;
  }
}

/* ------------------------------ skills parser ----------------------------- */
type Skill = "farming" | "fishing" | "foraging" | "mining" | "combat" | "luck";
type Skills = Record<Skill, number>;

function parseSkills(player: any): Skills {
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

    return skills;
  } catch (error) {
    throw error;
  }
}

/* ---------------------------- experience parser ---------------------------- */
type Experience = Record<Skill, number>;

function parseExperience(player: any): Experience {
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

  return experience;
}

/* ------------------------------ joja parser -------------------------------- */
type JojaMail =
  | "jojaCraftsRoom"
  | "jojaBoilerRoom"
  | "jojaVault"
  | "jojaPantry"
  | "jojaFishTank"
  | "ccMovieTheaterJoja";
const JOJAMAIL = new Set<JojaMail>([
  "jojaCraftsRoom",
  "jojaBoilerRoom",
  "jojaVault",
  "jojaPantry",
  "jojaFishTank",
  "ccMovieTheaterJoja",
]);

interface JojaMembership {
  isMember: boolean;
  developmentProjects: JojaMail[];
}

function parseJoja(player: any): JojaMembership {
  /*
    Achievements Relevant:
      - Joja Co. Member Of The Year (Purchase all Joja Community Development projects).
  */
  let isMember = false;
  try {
    let developmentProjectsCompleted: JojaMail[] = [];
    for (const mail of player.mailReceived.string) {
      if (JOJAMAIL.has(mail)) {
        developmentProjectsCompleted.push(mail as JojaMail);
      }
      if (mail === "JojaMember") isMember = true;
    }

    return {
      isMember: isMember,
      developmentProjects: developmentProjectsCompleted,
    };
  } catch (error) {
    throw error;
  }
}

/* ------------------------------ achievement parser -------------------------------- */
type Achievements = String[];

function parseAchievements(player: any): Achievements {
  try {
    let achievementsCompleted: string[] = [];
    if (player.achievements == "") return [];
    for (const a of player.achievements.int) {
      achievementsCompleted.push(a);
    }

    return achievementsCompleted;
  } catch (error) {
    throw error;
  }
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
  skills?: Skills;
  questsCompleted?: number;
  stardrops?: Stardrops;
  experience?: Experience;
  gameVersion?: string;
  jojaMembership?: JojaMembership;
  achievements?: Achievements;
}

export function parseGeneral(
  player: any,
  whichFarm: string,
  gameVersion: string,
): GeneralRet {
  try {
    const playerFormatUpdated = isPlayerFormatUpdated(player);
    const { name, totalMoneyEarned, millisecondsPlayed, farmName } = player;
    const timePlayed = msToTime(millisecondsPlayed);
    let questsCompleted = 0;
    if (playerFormatUpdated) {
      questsCompleted = GetStatValue(player.stats.Values, "questsCompleted");
    } else {
      questsCompleted = player.stats.questsCompleted;
    }

    let farmIdx = 0;

    if (whichFarm === "MeadowlandsFarm") farmIdx = 7;
    else farmIdx = parseInt(whichFarm);

    const farmInfo = `${farmName} Farm (${
      farmTypes[farmIdx % farmTypes.length]
    })`;

    const skills = parseSkills(player);
    const stardrops = parseStardrops(player);
    const experience = parseExperience(player);
    const jojaMembership = parseJoja(player);
    const achievements = parseAchievements(player);

    return {
      name,
      timePlayed,
      farmInfo,
      totalMoneyEarned,
      skills,
      questsCompleted,
      stardrops,
      experience,
      gameVersion,
      jojaMembership,
      achievements,
    };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseGeneral: ${e.message}`);
    else throw new Error(`Error in parseGeneral: ${e}`);
  }
}
