import type { Power } from "@/types/data";

import powers from "@/data/powers.json";
const powersData = powers as { [key: string]: Power };

import {
  GetStatValue,
  GetListOrEmpty,
  hasOrWillReceiveMail,
} from "@/lib/utils";

const semverLt = require("semver/functions/lt");

export function parsePowers(
  player: any,
  gameVersion: string,
  hostId: string,
  hostMailbox: Set<string>,
  hostMailReceived: Set<string>,
  hostMailForTomorrow: Set<string>,
) {
  try {
    // return set of powers where the power id is the string key
    const powers = new Set<string>();

    // powers are only in 1.6.0 and later
    if (semverLt(gameVersion, "1.6.0")) return powers;

    // create sets for each mail entry we need to check for O(1) lookup
    let mailReceived: Set<string>;
    let mailForTomorrow: Set<string>;
    let mailbox: Set<string>;
    let eventsSeen = new Set<string>(
      GetListOrEmpty(player.eventsSeen, "int").map((x: any) => x.toString()),
    );

    // if the player is not the host, use their mail data
    // otherwise use the host's mail data to not recompute it
    if (player.UniqueMultiplayerID.toString() !== hostId) {
      mailReceived = new Set<string>(
        GetListOrEmpty(player.mailReceived, "string"),
      );
      mailForTomorrow = new Set<string>(
        GetListOrEmpty(player.mailForTomorrow, "string"),
      );
      mailbox = new Set<string>(GetListOrEmpty(player.mailbox, "string"));
    } else {
      mailReceived = hostMailReceived;
      mailForTomorrow = hostMailForTomorrow;
      mailbox = hostMailbox;
    }

    // the save's host mail (Game1.player for now)
    for (const key in powersData) {
      const power = powersData[key];

      // playerKey is only "Current" or "Host" for powers
      if (power.playerKey === "Current") {
        let unlocked = false;
        // only check the current player
        switch (power.type) {
          case "mail":
            // also for powers exclusively, the rawType isn't defined so it's whether
            // the player has or will receive the mail flag
            unlocked = hasOrWillReceiveMail(
              power.flag,
              mailReceived,
              mailForTomorrow,
              mailbox,
            );
            break;
          case "stat":
            unlocked = GetStatValue(player.stats.Values, power.flag) === 1;
            break;
          case "event":
            unlocked = eventsSeen.has(power.flag);
            break;
        }

        if (unlocked) powers.add(key);
      } else if (power.playerKey === "Host") {
        // only check the host player (the logic seems to be weird here, source code uses Game1.MasterPlayer)
        // which appears to be different from Game1.player, but we'll just use Game1.player since we don't have
        // access to Game1.MasterPlayer
        let unlocked = hasOrWillReceiveMail(
          power.flag,
          hostMailReceived,
          hostMailForTomorrow,
          hostMailbox,
        );

        if (unlocked) powers.add(key);
      }
    }

    return powers;
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parsePowers: ${e.message}`);
    throw new Error(`Error in parsePowers: ${e}`);
  }
}
