import { Rarity } from "@shared/utils";
import ItemModel from "server/models/items/ItemModel";
import LootboxModel from "server/models/items/LootboxModel";
import UserModel from "server/models/users/UserModel";

function weightedRandomRarityChoice(rarityChances: Record<Rarity, number>) : Rarity {
    let random = Math.random();

    let cummulativeWeight = 0;
    for (const rarity of Object.values(Rarity)) {
    cummulativeWeight += rarityChances[rarity];
        if (cummulativeWeight >= random) {
            return rarity;
        }
    }

    throw Error;
}

export async function openLootBox(user: UserModel | undefined, lootboxId: number): Promise<ItemModel> {
    const lootbox = await LootboxModel.findOne({where: {id: lootboxId}});

    if (!lootbox) throw Error;

    const items = await ItemModel.findAll({where: {rarity: weightedRandomRarityChoice(lootbox.rarityChances)}})

    return items[Math.floor(Math.random() * items.length)];
}