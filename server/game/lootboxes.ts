import { Lootbox, lootboxes, LootboxKey, rarities, Rarity, RarityKey } from "@shared/schemas/game/lootboxes";
import UserModel from "server/models/users/UserModel";

Object.entries(lootboxes).forEach(([key, box]) => {
  const total = Object.values(box.dropRates).reduce((sum, r) => sum + r, 0);
  if (Math.abs(total - 1) > 0.0001) {
    throw new Error(`Lootbox ${key} drop rates sum to ${total}, expected 1`);
  }
});

function openLootbox(lootbox: Lootbox) {
  const roll = Math.random();
  const entries = Object.entries(lootbox.dropRates) as [RarityKey, number][];

  let rarity = rarities[entries.at(-1)![0]];

  let cumulative = 0;
  for (let i = 0; i < entries.length - 1; i++) {
    const [rarityKey, rate] = entries[i];
    cumulative += rate;
    if (roll < cumulative) {
      rarity = rarities[rarityKey];
      break;
    }
  }

  const names = rarity.names;

  return names[Math.floor(Math.random() * names.length)];
}

export function buyLootbox(user: UserModel, lootbox: Lootbox) {
  if (user.tokens < lootbox.price) return undefined;
  const title = openLootbox(lootbox);
  user.update({ title, tokens: user.tokens - lootbox.price });
  return title;
}