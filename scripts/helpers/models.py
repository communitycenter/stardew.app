from typing import TypedDict, Optional, Literal

# ---------------------------------------------------------------------------- #
#                             Processed Data Models                            #
# ---------------------------------------------------------------------------- #


class Object(TypedDict):
    name: str
    description: str
    category: str
    minVersion: str


class BigObject(TypedDict):
    name: str
    description: str
    minVersion: str


class MuseumPiece(TypedDict):
    locations: list[str]
    itemID: str


class Achievement(TypedDict):
    iconURL: str
    name: str
    description: str
    id: int


class TrackedIngredient(TypedDict):
    quantity: int
    usedIn: list[str]


class Ingredient(TypedDict):
    itemID: str
    quantity: int


class Recipe(TypedDict):
    ingredients: list[Ingredient]
    itemID: str
    minVersion: str
    unlockConditions: str


class CraftingRecipe(Recipe):
    isBigCraftable: bool


class TrapFish(TypedDict):
    itemID: str
    locations: list[str]
    minVersion: str
    trapFish: bool


class Fish(TypedDict):
    difficulty: str
    itemID: str
    locations: list[str]
    minLevel: int
    minVersion: str
    seasons: list[str]
    time: str
    trapFish: bool
    weather: str


class ShippingItem(TypedDict):
    itemID: str
    polyculture: bool
    minVersion: str
    monoculture: bool
    seasons: list[str]


class Villager(TypedDict):
    birthday: str
    datable: bool
    iconURL: str
    loves: list[int]
    name: str


class Power(TypedDict):
    description: str
    flag: str
    minVersion: str
    name: str
    playerKey: Literal["Any", "All", "Current", "Target", "Host"]
    type: Literal["mail", "event", "stat"]


class MonsterGoal(TypedDict):
    count: int
    name: str
    reward: Optional[str]
    targets: list[str]


# ---------------------------------------------------------------------------- #
#                                 Data/Objects                                 #
# ---------------------------------------------------------------------------- #


class CustomAttributesModel(TypedDict):
    FarmingLevel: int
    FishingLevel: int
    MiningLevel: int
    LuckLevel: int
    ForagingLevel: int
    MaxStamina: int
    MagneticRadius: int
    Speed: int
    Defense: int
    Attack: int


class BuffModel(TypedDict):
    BuffId: Optional[Literal["food", "drink"]]
    IconTexture: None
    Duration: int
    IsDebuff: bool
    GlowColor: None
    CustomAttributes: CustomAttributesModel


class QuantifyModifierModel(TypedDict):
    """
    See https://stardewvalleywiki.com/Modding:Item_queries#Quantity_modifiers when it is updated
    """

    Id: str
    Condition: str
    Modification: int
    Amount: float
    RandomAmount: None


class GeodeDropsModel(TypedDict):
    Chance: float
    """
    The probability that the item will be dropped if the other fields match, as a decimal value between 0 (never) and 1 (always). Default 1.0
    """
    SetFlagOnPickup: Optional[str]
    """
    The mail flag to set for the current player when this drop is picked up.
    """
    Precedence: int
    """
    The order in which this entry should be checked, where lower values are checked first. 
    This can be a negative value. Geode drops with the same precedence are checked in order listed. Default 0.
    """
    Id: str
    """
    The unique string ID fo this enty (not the item itself) within the current list.
    This is semi-optional -- if ommitted, it'll be auto-generated based on the `ItemId`, `RandomItemId`, and `IsRecipe` fields. 
    However multiple entries with the same ID may cause unintended behavior (e.g. shop items reducing each others' stock limits), so it's often a good idea to set a globally unique ID instead.
    """
    ItemId: str
    """
    One of:\n
    * the qualified or unqualified item ID (like (O)128 for a pufferfish)
    * or an [item query](https://stardewvalleywiki.com/Modding:Item_queries#Item_queries) to dynamically choose one or more items.
    """
    RandomItemId: Optional[list[str]]
    """
    A list of item IDs to randomly choose from, using the same format as `ItemId` (including item queries).
    If set, `ItemId` is optional and ignored. Each entry in the list has an equal probablity of being chosen.
    For example:
    ```json
    // wood, stone, or pizza
    "RandomItemId": [ "(O)388", "(O)390", "(O)206" ]
    ```
    """
    Condition: Optional[str]
    """
    A [game state query](https://stardewvalleywiki.com/Modding:Game_state_queries) which indicates whether this entry should be applied.
    Defaults to always true.
    """
    PerItemCondition: Optional[str]
    """
    A [game state query](https://stardewvalleywiki.com/Modding:Game_state_queries) which indicates whether an item produced from the other fields should be returned.
    Defaults to always true.
    """
    MaxItems: Optional[int]
    """
    If this entry produces multiple separate item stacks, the maximum number to return.
    (This does *not* affect the size of each stack; see `MinStack` and `MaxStack` for that.)
    Default unlimited.
    """
    IsRecipe: bool
    """
    Whether to get the crafting/cooking recipe for the item, instead of the item itself.
    Default false
    """
    Quality: int
    """
    The quality of the item to find. One of 0 (normal), 1 (silver), 2 (gold), or 4 (iridium). 
    Invalid values will snap to the closest valid one (e.g. 7 will become iridium). 
    Default -1, which keeps the value set by the item query (usually 0).
    """
    MinStack: int
    """
    The item's minimum and default stack size. Default -1, which keeps the value set by the item query (usually 1).
    """
    MaxStack: int
    """
    If set to a value higher than MinStack, the stack is set to a random value between them (inclusively). Default -1.
    """
    ObjectDisplayName: Optional[str]
    """
    For objects only, a [tokenizable string](https://stardewvalleywiki.com/Modding:Tokenizable_strings) for the item's display name.\n
    Defaults to the item's display name in `Data/Objects`. This can optionally contain `%DISPLAY_NAME` (the item's default display name) and `%PRESERVED_DISPLAY_NAME` (the preserved item's display name if applicable, e.g. if set via `PreserveId` in [machine data](https://stardewvalleywiki.com/Modding:Item_queries#Custom_machines))
    """
    ToolUpgradeLevel: int
    """
    For tools only, the initial upgrade level for the tool when created (like Copper vs Gold Axe, or Training Rod vs Iridium Rod).
    Default -1, which keeps the value set by the item query (usually 0).
    """
    QualityModifiers: Optional[list[QuantifyModifierModel]]
    """
    [Quantity modifiers](https://stardewvalleywiki.com/Modding:Item_queries#Quantity_modifiers) applied to the Quality or Stack value. Default none.
    The quality modifiers operate on the numeric quality values (i.e. 0 = normal, 1 = silver, 2 = gold, and 4 = iridium). For example, silver x 2 is gold.
    """
    StackModifiers: Optional[list[QuantifyModifierModel]]
    """
    [Quantity modifiers](https://stardewvalleywiki.com/Modding:Item_queries#Quantity_modifiers) applied to the Quality or Stack value. Default none.
    The quality modifiers operate on the numeric quality values (i.e. 0 = normal, 1 = silver, 2 = gold, and 4 = iridium). For example, silver x 2 is gold.
    """
    QualityModifierMode: Optional[int]
    """
    See [Quantity modifier modes](https://stardewvalleywiki.com/Modding:Item_queries#Quantity_modifier) when it is updated

    For now, always appears to be 0.
    """
    StackModifierMode: Optional[int]
    """
    See [Quantity modifier modes](https://stardewvalleywiki.com/Modding:Item_queries#Quantity_modifier) when it is updated

    For now, always appears to be 0.
    """


class ContentObjectModel(TypedDict):
    Name: str
    """
    Internal Item Name
    """
    DisplayName: str
    """
    A Tokenizable string for the item's in-game display name. Ex: '[LocalizedText Strings\\Objects:MagicRockCandy_Name]' 
    """
    Description: str
    """
    A Tokenizable string for the item's in-game description. Ex: '[LocalizedText Strings\\Objects:MagicRockCandy_Description]' 
    """
    Type: str
    """
    The Item's general type. Arch, Minerals, etc.
    """
    Category: int
    """
    The item category. Ex: -2 for Minerals
    """
    Price: int
    """
    The price when sold by the player. Not the price when bought from a shop. Default 0.
    """
    Texture: None
    """
    The asset name for the texture containing the item's sprite. Defaults to Maps/springobjects
    """
    SpriteIndex: int
    """
    The sprite's index within the `Texture`, where 0 is the top-left sprite.
    """
    Edibility: int
    """
    A numeric value that determines how much energy (edibility x 2.5) and health (edibility x 1.125) is restored when this item is eaten. An item with an edibility of -300 can't be eaten, values from -299 to -1 reduce health and energy, and zero can be eaten but doesn't change health/energy. Default -300.
    """
    IsDrink: bool
    """
    Whether to drink the item instead of eating it. Default false.
    """
    Buff: Optional[BuffModel]
    """
    The custom buff attributes to apply, if any.
    """
    GeodeDropsDefaultItems: bool
    """
    Chooses a predefined list of possible geode drops like clay, coal, copper, iridium, etc. Default false.
    """
    GeodeDrops: Optional[list[GeodeDropsModel]]
    """
    The items that can be dropped when breaking open this item as a geode. Specifying either or both fields automatically enables geode behavior for this item.
    `GeodeDrops` can be set to the specific items to drop. Default none.
    """
    ArtifactSpotChances: Optional[dict[str, float]]
    """
    If this is an artifact (i.e. the `Type` field is `Arch`), the chance that it can be found by digging artifact spots in each location.
    This consists of a string → model lookup, where:

        * the key is the internal location name;
        * the value is the probability the item will spawn if checked, as a decimal value between 0 (never) and 1 (always).
    """
    ContextTags: Optional[list[str]]
    """
    The custom [context tags](https://stardewvalleywiki.com/Modding:Items#Context_tags) to add for this item (in addition to the tags added automatically based on the other object data).
    This is formatted as a list; for example: 
    ```json
    "ContextTags": [ "color_yellow", "fish_ocean", "fish_upright", "season_summer" ]
    ```
    """
    ExcludeFromRandomSale: bool
    """
    Whether to exclude this item from shops when selecting random items to sell. Default false.
    """
    ExcludeFromFishingCollection: bool
    """
    Whether to exclude this item from the fishing/shipping collection and their respective effect on the perfection score. 
    Default false, in which case the normal requirements apply (e.g. artifacts are always excluded from the shipping collection).
    """
    ExcludeFromShippingCollection: bool
    """
    Whether to exclude this item from the fishing/shipping collection and their respective effect on the perfection score. 
    Default false, in which case the normal requirements apply (e.g. artifacts are always excluded from the shipping collection).
    """
    CustomFields: None


# ---------------------------------------------------------------------------- #
#                                 BigCraftables                                #
# ---------------------------------------------------------------------------- #
class ContentBigObjectModel(TypedDict):
    Name: str
    """The internal item name"""
    DisplayName: str
    """
    A [tokenizable string](https://stardewvalleywiki.com/Modding:Tokenizable_strings) for the item's in-game display name.
    """
    Description: str
    """
    A [tokenizable string](https://stardewvalleywiki.com/Modding:Tokenizable_strings) for the item's in-game display description.
    """
    Price: int
    """
    The price when sold by the player. This is not the price when bought from a shop. Default 0.
    """
    Fragility: int
    """
    How the item can be picked up. The possible values are 0 (pick up with any tool), 
    1 (destroyed if hit with an axe/hoe/pickaxe, or picked up with any other tool), 
    or 2 (can't be removed once placed). Default 0.
    """
    CanBePlacedIndoors: bool
    """
    Whether this item can be placed indoors. Default true.
    """
    CanBePlacedOutdoors: bool
    """
    Whether this item can be placed outdoors. Default true.
    """
    IsLamp: bool
    """
    Whether this is a lamp and should produce light when dark. Default false.
    """
    Texture: None
    """
    The asset name for the texture containing the item's sprite. Defaults to `TileSheets/Craftables`.
    """
    SpriteIndex: int
    """
    The sprite's index within the `Texture`, where 0 is the top-left sprite.
    """
    ContextTags: Optional[list[str]]
    """
    The custom [context tags](https://stardewvalleywiki.com/Modding:Items#Context_tags) to add for this item (in addition to the tags added automatically based on the other object data).
    This is formatted as a list; for example: 
    ```json
    "ContextTags": [ "color_yellow", "fish_ocean", "fish_upright", "season_summer" ]
    ```
    """
    CustomFields: None


# ---------------------------------------------------------------------------- #
#                                Data/Crops.json                               #
# ---------------------------------------------------------------------------- #
class PlantableLocationRulesModel(TypedDict):
    Id: str
    """The unique string ID for this entry within the list."""
    Result: Literal["Default", "Allow", "Deny"]
    """Indicates whether the seed can be planted in a location if this entry is
    selected. The possible values are:
    * `Default`: the seed can be planted if the location normally allows it.
    * `Allow`: the seed can be planted here, regardless of whether the location normally allows it.
    * `Deny`: the seed can't be planted here, regardless of whether the location normally allows it.
    """
    Condition: Optional[str]
    """A [game state query](https://stardewvalleywiki.com/Modding:Game_state_queries)
    which indicates whether this entry applies."""
    PlantedIn: Literal["Ground", "GardenPot", "Any"]
    """The planting context to apply this rule for. The possible values are
    `Ground` (planted directly in dirt), `GardenPot` (planted in a [garden pot](https://stardewvalleywiki.com/Garden_Pot)),
    or `Any`. 
    
    Default `Any`."""
    DeniedMessage: Optional[str]
    """If this rule prevents planting the seed, the tokenizable string to show
    to the player (or `null` to default to the normal behavior for the context).
    This also applies when the Result is `Default`, if that causes the planting to be denied."""


class ContentCropItem(TypedDict):
    """
    Consists of a string → model lookup, where:
    * the key is the unqualified item ID for the seed item.
    * the value is the model for the crop item.
    """

    Seasons: list[Literal["Spring", "Summer", "Fall", "Winter"]]
    """The seasons in which this crop can grow."""
    DaysInPhase: list[int]
    """
    The number of days in each visual step of growth before the crop is
    harvestable. Each step corresponds to a sprite in the crop's row (see `SpriteIndex`).

    For example, a crop with `"DaysInPhase": [1, 1, 1, 1]` will grow from seed
    to harvestable in 4 days, moving to the next sprite each day.
    """
    RegrowDays: int
    """
    The number of days before the crop regrows after harvesting, or `-1` if it
    can't regrow.

    Default `-1`.
    """
    IsRaised: bool
    """Whether this is a raised crop on a trellis that can't be walked through.
    
    Default `false`.
    """
    IsPaddyCrop: bool
    """Whether this crop can be planted near water for a unique paddy dirt
    texture, faster growth time, and auto-watering. For example, rice and taro are paddy crops.
    
    Default `false`.
    """
    NeedsWatering: bool
    """Whether this crop needs to be watered to grow (e.g. fiber seeds don't). 
    
    Default `true`."""
    HarvestItemId: str
    """The unqualified item ID produced when this crop is harvested."""
    HarvestMethod: Literal["Grab", "Scythe"]
    """How the crop can be harvested. This can be `Grab` (crop is harvested by hand)
    or `Scythe` (crop is harvested with a [scythe](https://stardewvalleywiki.com/Scythe)).

    Default `Grab`.
    """
    HarvestMinStack: int
    """
    The minimum number of HarvestItemId to produce
    (before HarvestMaxIncreasePerFarmingLevel and ExtraHarvestChance are applied).
    A value within this range (inclusive) will be randomly chosen each time the crop is harvested.
    The minimum defaults to 1.

    Default `1`.
    """
    HarvestMaxStack: int
    """
    The maximum number of HarvestItemId to produce
    (before HarvestMaxIncreasePerFarmingLevel and ExtraHarvestChance are applied).
    A value within this range (inclusive) will be randomly chosen each time the crop is harvested.
    The maximum defaults to the minimum.
    """
    HarvestMinQuality: int
    """
    The minimum quality of the harvest crop.

    Default `0`.
    """
    HarvestMaxQuality: Optional[int]
    HarvestMaxIncreasePerFarmingLevel: float
    """The number of extra harvests to produce per farming level. This is
    rounded down to the nearest integer and added to HarvestMaxStack.
    
    Defaults to `0.0`.
    """
    ExtraHarvestChance: float
    """The probability that harvesting the crop will produce extra harvest items,
    as a value between 0 (never) and 0.9 (nearly always). This is repeatedly
    rolled until it fails, then the number of successful rolls is added to the produced count.

    Defaults to `0.0`.
    """
    Texture: Literal["TileSheets\\crops"]
    """The asset name for the texture (under the game's `Content` folder)
    containing the crop sprite. Vanilla crops use `TileSheets\\crops`.
    """
    SpriteIndex: int
    """The index of this crop in the `Texture`, one crop per row, where 0 is the top row.
    
    Default `0`."""
    TintColors: list[str]
    """The colors with which to tint the sprite when drawn (e.g. for colored flowers).
    A random color from the list will be chosen for each crop. See [color format](https://stardewvalleywiki.com/Modding:Migrate_to_Stardew_Valley_1.6#Color_fields).

    Default `[]`.
    """
    CountForMonoculture: bool
    """Whether the player can ship 300 of this crop's harvest item to unlock the
    monoculture achievement.
    
    Default `false`."""
    CountForPolyculture: bool
    """Whether the player must ship 15 of this crop's harvest item (along with
    any other required crops) to unlock the polyculture achievement.
    
    Default `false`."""
    PlantableLocationRules: Optional[list[PlantableLocationRulesModel]]
    """The rules to decide which locations you can plant the seed in, if applicable.
    The first matching rule is used. This can override location checks
    (e.g. crops being limited to the farm), but not built-in requirements like
    crops needing dirt."""
    CustomFields: None


class ContentCharacterModel(TypedDict):
    """https://stardewvalleywiki.com/Modding:Migrate_to_Stardew_Valley_1.6#Custom_NPCs"""

    DisplayName: str
    Language: Literal["default", "Dwarvish"]
    Gender: Literal["Female", "Male", "Undefined"]
    Age: Literal["Child", "Teen", "Adult"]
    Manner: Literal["Neutral", "Polite", "Rude"]
    SocialAnxiety: Literal["Neutral", "Outgoing", "Shy"]
    Optimism: Literal["Neutral", "Negative", "Positive"]
    BirthSeason: Literal["Spring", "Summer", "Fall", "Winter"]
    BirthDay: int
    HomeRegion: Literal["Desert", "Town", "Other"]
    IsDarkSkinned: bool
    CanSocialize: Optional[str]
    CanBeRomanced: bool
    CanReceiveGifts: bool
    CanCommentOnPurchasedShopItems: Optional[bool]
    CanGreetNearbyCharacters: bool
    CanVisitIsland: Optional[str]
    LoveInterest: Optional[str]
    Calendar: Literal["HiddenAlways", "HiddenUntilMet", "AlwaysShown"]
    SocialTab: Literal[
        "HiddenAlways", "HiddenUntilMet", "UnknownUntilMet", "AlwaysShown"
    ]
    SocialTabIconSourceRect: None
    SpouseAdopts: Optional[str]
    SpouseWantsChildren: Optional[str]
    SpouseGetsJealousOfGifts: Optional[str]
    SpouseRoom: Optional[dict]  # TODO: Add this model if we need it
    SpousePatio: Optional[dict]  # TODO: Add this model if we need it
    SpouseFloors: list[str]
    SpouseWallpapers: list[str]
    IntroductionsQuest: Optional[bool]
    ItemDeliveryQuests: Optional[bool]
    PerfectionScore: bool
    EndSlideShow: Literal["Hidden", "MainGroup", "TrailingGroup"]
    FriendsAndFamily: dict[str, str]

    # TODO: Add the rest of the fields but the rest of it isn't needed


# ---------------------------------------------------------------------------- #
#                                    powers                                    #
# ---------------------------------------------------------------------------- #
class ContentPowerModel(TypedDict):
    DisplayName: str
    Description: str
    TexturePath: str
    TexturePosition: dict[str, int]
    UnlockedCondition: str


# ---------------------------------------------------------------------------- #
#                                   monsters                                   #
# ---------------------------------------------------------------------------- #
class ContentMonsterGoalModel(TypedDict):
    DisplayName: str
    Targets: list[str]
    Count: int
    RewardItemId: Optional[str]  # qualified item ID
    RewardItemPrice: int  # default -1
    RewardDialogue: Optional[str]
    RewardDialogueFlag: Optional[str]
    RewardFlag: Optional[str]
    RewardFlagAll: Optional[str]
    CustomFields: None
