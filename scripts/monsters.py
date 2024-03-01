# Purpose: Get all the monster goals in the game along with what monsters count towards them.
# Result is saved to data/monsters.json
#
# Content Files used: Data/MonsterSlayerQuests, Data/Characters/Monsters (all pngs)
# Wiki Pages used: none

from tqdm import tqdm

from helpers.models import MonsterGoal, ContentMonsterGoalModel
from helpers.utils import load_content, save_json, has_dangerous_variant, get_string

QUESTS: dict[str, ContentMonsterGoalModel] = load_content("MonsterSlayerQuests")


def get_monster_goals() -> dict[str, MonsterGoal]:
    output: dict[str, MonsterGoal] = {}

    for quest in tqdm(QUESTS.values()):
        name = get_string(quest["DisplayName"])
        targets = []

        for monster in quest["Targets"]:
            # Green Slime doesn't mean it only counts green slimes
            monster_name = "Slimes" if monster == "Green Slime" else monster
            targets.append(monster_name)

            if has_dangerous_variant(monster):
                targets.append(monster_name + " (dangerous)")

        output[name] = {
            "count": quest["Count"],
            "name": name,
            "reward": quest["RewardItemId"],
            "targets": targets,
        }

    return output


if __name__ == "__main__":
    monsters = get_monster_goals()
    save_json(monsters, "monsters.json", sort=False, minify=True)
