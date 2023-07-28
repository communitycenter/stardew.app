function msToTime(time: number): string {
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}
/* ---------------------------- stardrops parser ---------------------------- */
interface StardropsRet {
  stardropsCount: number;
  stardrops: Record<string, boolean>;
}

const STARDROPS = {
  CF_Fair: "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
  CF_Fish:
    "Received in mail from Willy after completing the Master Angler Achievement.",
  CF_Mines: "Obtained from the treasure chest on floor 100 in The Mines.",
  CF_Sewer: "Can be purchased from Krobus for 20,000g in The Sewers.",
  CF_Spouse:
    "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  CF_Statue:
    "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  museumComplete: "Reward for donating all 95 items to the Museum.",
};

function parseStardrops(player: any): StardropsRet {
  /*
        Achievements Relevant:
        - Mystery Of The Stardrops (find every stardrop).
    */
  try {
    let count = 0;
    let stardrops: Record<string, boolean> = {};

    // initialize stardrops
    for (const key in STARDROPS) {
      stardrops[key] = false;
    }

    // look through the player's mail for the stardrops
    if (!player.mailReceived || typeof player.mailReceived !== "object") {
      throw new Error("mailReceived is not an object");
    }

    if (typeof player.mailReceived.string === "object") {
      for (const idx in player.mailReceived.string) {
        let mail = player.mailReceived.string[idx];
        if (STARDROPS.hasOwnProperty(mail)) {
          count++;
          stardrops[mail] = true;
        }
      }

      // early return if all stardrops are found
      if (count === Object.keys(STARDROPS).length) {
        return { stardropsCount: count, stardrops };
      }
    } else {
      // only one mail received
      if (STARDROPS.hasOwnProperty(player.mailReceived.string)) {
        count++;
        stardrops[player.mailReceived.string] = true;
      }
    }

    return {
      stardropsCount: count,
      stardrops,
    };
  } catch (error) {
    throw error;
  }
}

/* ------------------------------ skills parser ----------------------------- */
interface SkillsRet {
  levels: { [key: string]: number }; // skills and levels
  maxLevelCount: number; // used for determing achievement completion
}

function parseSkills(player: any): SkillsRet {
  /*
    Achievements Relevant:
      - Singular Talent (level 10 in at least one skill).
      - Master of the Five Ways (level 10 in every skill).
  */
  try {
    const skillLevels = [
      player.farmingLevel,
      player.fishingLevel,
      player.foragingLevel,
      player.miningLevel,
      player.combatLevel,
      player.luckLevel, // unused as of 1.5
    ];

    // formula for player level is (farmingLevel + fishingLevel + foragingLevel + miningLevel + combatLevel + luckLevel) / 2
    let maxLevelCount = 0;
    // as we loop through the levels, we can check if the level is 10 and increment maxLevelCount
    const playerLevel = Math.floor(
      skillLevels.reduce((prev, curr) => {
        if (curr === 10) maxLevelCount++;
        return prev + curr;
      }, 0) / 2
    );

    const levels = {
      Player: playerLevel,
      Farming: skillLevels[0],
      Fishing: skillLevels[1],
      Foraging: skillLevels[2],
      Mining: skillLevels[3],
      Combat: skillLevels[4],
      Luck: skillLevels[5],
    };

    return { levels, maxLevelCount };
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
];

export interface GeneralRet {
  name: string;
  timePlayed: string;
  farmInfo: string;
  totalMoneyEarned: number;
  levels: { [key: string]: number };
  maxLevelCount: number;
  questsCompleted: number;
  stardropsCount: number;
  stardrops: Record<string, boolean>;
}

export function parseGeneral(player: any, whichFarm: number): GeneralRet {
  try {
    const { name, totalMoneyEarned, millisecondsPlayed, farmName } = player;
    const timePlayed = msToTime(millisecondsPlayed);
    const questsCompleted = player.stats.questsCompleted;

    const farmInfo = `${farmName} Farm (${
      farmTypes[whichFarm % farmTypes.length]
    })`;

    const { levels, maxLevelCount } = parseSkills(player);
    const { stardropsCount, stardrops } = parseStardrops(player);

    return {
      name,
      timePlayed,
      farmInfo,
      totalMoneyEarned,
      levels,
      maxLevelCount,
      questsCompleted,
      stardropsCount,
      stardrops,
    };
  } catch (e) {
    let msg = "";
    if (e instanceof Error) {
      msg = e.message;
    }
    throw new Error(`Error in parseGeneral(): ${msg}`);
  }
}
