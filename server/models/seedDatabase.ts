import { Rarity } from "@shared/utils";
import { managementDatabase } from "./sequelize";
import ItemModel from "./items/ItemModel";
import syncDatabase from "./syncDatabase";
import LootboxModel from "./items/LootboxModel";

async function seedItems() {
  await managementDatabase.addModels([ItemModel]);

  await managementDatabase.sync();

  const items = [
    { name: "Scouting Serf", rarity: Rarity.COMMON },
    { name: "Pond Scum", rarity: Rarity.COMMON },
    { name: "Roadkill", rarity: Rarity.COMMON },
    { name: "Esan Ebner the Eternal Benchwarmer", rarity: Rarity.COMMON },
    { name: "Field Furniture", rarity: Rarity.COMMON },
    { name: "Warm Body", rarity: Rarity.COMMON },
    { name: "Cold Body", rarity: Rarity.COMMON },
    { name: "Button Masher", rarity: Rarity.COMMON },
    { name: "Evil Scout", rarity: Rarity.COMMON },
    { name: "Woody's Uncle", rarity: Rarity.COMMON },
    { name: "Business Freshman", rarity: Rarity.COMMON },
    { name: "Leadership Position", rarity: Rarity.COMMON },
    { name: "Loser", rarity: Rarity.COMMON },
    { name: "Oxygen Thief", rarity: Rarity.COMMON },
    { name: "Human Speedbump", rarity: Rarity.COMMON },
    { name: "Waterboy's Waterboy's Waterboy", rarity: Rarity.COMMON },
    { name: "Bolt Basher", rarity: Rarity.COMMON },
    { name: "Robot Wrangler", rarity: Rarity.COMMON },
    { name: "Helmet Wearer", rarity: Rarity.COMMON },
    { name: "Certified Menace", rarity: Rarity.UNCOMMON },
    { name: "Scouting Scoundrel", rarity: Rarity.UNCOMMON },
    { name: "World Champion", rarity: Rarity.UNCOMMON },
    { name: "Mechanical Merchant", rarity: Rarity.UNCOMMON },
    { name: "Data Dominator", rarity: Rarity.UNCOMMON },
    { name: "Robot Royalty", rarity: Rarity.UNCOMMON },
    { name: "Match Manipulator", rarity: Rarity.UNCOMMON },
    { name: "Medium Ball Knowledge", rarity: Rarity.UNCOMMON },
    { name: "Statbotics Nerd", rarity: Rarity.UNCOMMON },
    { name: "Waterboy's Waterboy", rarity: Rarity.UNCOMMON },
    { name: "Pit Boss", rarity: Rarity.UNCOMMON },
    { name: "Observation Oracle", rarity: Rarity.UNCOMMON },
    { name: "Desperate Driver", rarity: Rarity.UNCOMMON },
    { name: "Ukrainian", rarity: Rarity.UNCOMMON },
    { name: "Kit Bot Killer", rarity: Rarity.RARE },
    { name: "CAN Criminal", rarity: Rarity.RARE },
    { name: "Madtown Murderer", rarity: Rarity.RARE },
    { name: "CTO", rarity: Rarity.RARE },
    { name: "COO", rarity: Rarity.RARE },
    { name: "Potato Planting Lead", rarity: Rarity.RARE },
    { name: "Mini-Milo", rarity: Rarity.RARE },
    { name: "Waterboy", rarity: Rarity.RARE },
    { name: "Chief Delphi Scroller", rarity: Rarity.RARE },
    { name: "Electrical Juicer", rarity: Rarity.RARE },
    { name: "Dracula Flow", rarity: Rarity.RARE },
    { name: "Data Degenerate", rarity: Rarity.EPIC },
    { name: "Ronald Reagan", rarity: Rarity.EPIC },
    { name: "Divine Intellect", rarity: Rarity.EPIC },
    { name: "The Tide's Coming In", rarity: Rarity.EPIC },
    { name: "Potatony", rarity: Rarity.EPIC },
    { name: "Boy", rarity: Rarity.EPIC },
    { name: "CEO", rarity: Rarity.EPIC },
    { name: "Tank Tread Burner", rarity: Rarity.EPIC },
    { name: "Rohan Reddy", rarity: Rarity.EINSTEIN },
    { name: "Certified Gambler", rarity: Rarity.EINSTEIN },
    { name: "Fully Fried", rarity: Rarity.EINSTEIN },
    { name: "Thomas Priego", rarity: Rarity.EINSTEIN },
    { name: "Gearbox Gangster", rarity: Rarity.EINSTEIN },
    { name: "Ankit's Angel", rarity: Rarity.EINSTEIN },
    { name: "Erik’s Favorite", rarity: Rarity.BOYLED },
    { name: "PhD Dropout", rarity: Rarity.BOYLED },
    { name: "I Like Robots", rarity: Rarity.BOYLED },
  ];

  for (const item of items) {
    await ItemModel.findOrCreate({
      where: { name: item.name },
      defaults: item,
    });
  }

  console.log("Items seeded!");
}

async function seedLootBoxes() {
  await managementDatabase.addModels([LootboxModel]);

  await managementDatabase.sync();

  const lootBoxes = [
    {
      name: "Peachtree",
      cost: 100,
      rarityChances: {
        [Rarity.COMMON]: 0.55,
        [Rarity.UNCOMMON]: 0.25,
        [Rarity.RARE]: 0.15,
        [Rarity.EPIC]: 0.04,
        [Rarity.EINSTEIN]: 0.01,
        [Rarity.BOYLED]: 0,
      },
    },
    {
      name: "Texas",
      cost: 250,
      rarityChances: {
        [Rarity.COMMON]: 0.30,
        [Rarity.UNCOMMON]: 0.35,
        [Rarity.RARE]: 0.20,
        [Rarity.EPIC]: 0.10,
        [Rarity.EINSTEIN]: 0.05,
        [Rarity.BOYLED]: 0,
      },
    },
    {
      name: "Michigan",
      cost: 550,
      rarityChances: {
        [Rarity.COMMON]: 0.15,
        [Rarity.UNCOMMON]: 0.30,
        [Rarity.RARE]: 0.30,
        [Rarity.EPIC]: 0.15,
        [Rarity.EINSTEIN]: 0.10,
        [Rarity.BOYLED]: 0,
      },
    },
    {
      name: "California",
      cost: 750,
      rarityChances: {
        [Rarity.COMMON]: 0.07,
        [Rarity.UNCOMMON]: 0.20,
        [Rarity.RARE]: 0.34,
        [Rarity.EPIC]: 0.22,
        [Rarity.EINSTEIN]: 0.14,
        [Rarity.BOYLED]: 0.03,
      },
    },
    {
      name: "Israel",
      cost: 1200,
      rarityChances: {
        [Rarity.COMMON]: 0.01,
        [Rarity.UNCOMMON]: 0.16,
        [Rarity.RARE]: 0.31,
        [Rarity.EPIC]: 0.28,
        [Rarity.EINSTEIN]: 0.18,
        [Rarity.BOYLED]: 0.07,
      },
    },
  ];

  for (const lootBox of lootBoxes) {
    await LootboxModel.findOrCreate({
      where: {name: lootBox.name},
      defaults: lootBox
    });
  }

  console.log("Lootboxes seeded!")
}

async function seedDatabase() {
  seedItems().then(seedLootBoxes);
}

export default seedDatabase;
