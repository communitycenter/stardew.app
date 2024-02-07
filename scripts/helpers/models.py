from typing import TypedDict, Optional, Literal

# ---------------------------------------------------------------------------- #
#                             Processed Data Models                            #
# ---------------------------------------------------------------------------- #


class Object(TypedDict):
    name: str
    description: str
    category: str
    iconURL: str


class BigObject(TypedDict):
    name: str
    description: str
    iconURL: str


class MuseumPiece(TypedDict):
    locations: list[str]
    itemID: int


class Achievement(TypedDict):
    iconURL: str
    name: str
    description: str
    id: int


class TrackedIngredient(TypedDict):
    quantity: int
    usedIn: list[int]


class Ingredient(TypedDict):
    itemID: int
    quantity: int


class Recipe(TypedDict):
    itemID: int
    ingredients: list[Ingredient]
    unlockConditions: str


class CraftingRecipe(Recipe):
    isBigCraftable: bool


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
