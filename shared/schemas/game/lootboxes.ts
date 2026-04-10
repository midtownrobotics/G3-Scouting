// ============ RARITIES ============
export type Rarity = {
    displayName: string;
    color: string;
    names: string[];
}

export const rarities = {
    COMMON: {
        displayName: "Common",
        color: "#a0a0a0",
        names: [
            "Scouting Serf", "Pond Scum", "Roadkill",
            "Esan Ebner the Eternal Benchwarmer", "Field Furniture",
            "Warm Body", "Cold Body", "Button Masher", "Evil Scout",
            "Woody's Uncle", "Business Freshman", "Leadership Position",
            "Loser", "Oxygen Thief", "Human Speedbump",
            "Waterboy's Waterboy's Waterboy", "Bolt Basher",
            "Robot Wrangler", "Helmet Wearer", "Netanbatu", "Thumb Driller",
        ],
    },
    UNCOMMON: {
        displayName: "Uncommon",
        color: "#4caf50",
        names: [
            "Certified Menace", "Scouting Scoundrel", "World Champion",
            "Mechanical Merchant", "Data Dominator", "Robot Royalty",
            "Match Manipulator", "Medium Ball Knowledge", "Statbotics Nerd",
            "Waterboy's Waterboy", "Pit Boss", "Observation Oracle",
            "Desperate Driver", "Ukrainian", "Big Al",
        ],
    },
    RARE: {
        displayName: "Rare",
        color: "#4a90e2",
        names: [
            "Kit Bot Killer", "CAN Criminal", "Madtown Murderer",
            "CTO", "COO", "Potato Planting Lead", "Mini-Milo",
            "Waterboy", "Chief Delphi Scroller", "Electrical Juicer",
            "Dracula Flow", "Rileys Goon"
        ],
    },
    EPIC: {
        displayName: "Epic",
        color: "#9b59b6",
        names: [
            "Data Degenerate", "Ronald Reagan", "Divine Intellect",
            "The Tide's Coming In", "Potatony", "Boy", "CEO",
            "Tank Tread Burner", "Woodys Toe"
        ],
    },
    EINSTEIN: {
        displayName: "Einstein",
        color: "#f5a623",
        names: [
            "Rohan Reddy", "Certified Gambler", "Fully Fried",
            "The Reaper👃", "Gearbox Gangster", "Ankit's Angel",
            "NetanBOThu",
        ],
    },
    BOYLED: {
        displayName: "Boyled",
        color: "#e74c3c",
        names: [
            "Erik's Favorite", "PhD Dropout", "I Like Robots", "Tunnel Dweller"
        ],
    },
} satisfies Record<string, Rarity>;

export type RarityKey = keyof typeof rarities;

// ============ LOOTBOXES ============

type DropRates = Record<RarityKey, number>;

export type Lootbox = {
    name: string;
    price: number;
    color: string;
    dropRates: DropRates;
};

export const lootboxes = {
    SC: {
        name: "SC Crate",
        price: 40,
        color: "#ac773aff",
        dropRates: { COMMON: 0.55, UNCOMMON: 0.25, RARE: 0.15, EPIC: 0.04, EINSTEIN: 0.01, BOYLED: 0.00 },
    },
    PCH: {
        name: "PCH Crate",
        price: 90,
        color: "#c4c4c4ff",
        dropRates: { COMMON: 0.30, UNCOMMON: 0.35, RARE: 0.20, EPIC: 0.10, EINSTEIN: 0.05, BOYLED: 0.00 },
    },
    FIM: {
        name: "FIM Crate",
        price: 170,
        color: "#782929ff",
        dropRates: { COMMON: 0.15, UNCOMMON: 0.30, RARE: 0.30, EPIC: 0.15, EINSTEIN: 0.10, BOYLED: 0.00 },
    },
    CALIFORNIA: {
        name: "CA Crate",
        price: 260,
        color: "#f5a623",
        dropRates: { COMMON: 0.07, UNCOMMON: 0.20, RARE: 0.34, EPIC: 0.22, EINSTEIN: 0.14, BOYLED: 0.03 },
    },
    ISRAEL: {
        name: "Israel Crate",
        price: 400,
        color: "#49b2ebff",
        dropRates: { COMMON: 0.01, UNCOMMON: 0.15, RARE: 0.31, EPIC: 0.28, EINSTEIN: 0.18, BOYLED: 0.07 },
    },
} satisfies Record<string, Lootbox>;

export type LootboxKey = keyof typeof lootboxes;