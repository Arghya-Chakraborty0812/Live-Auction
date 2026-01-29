import { getAllItems } from "../models/itemModel.js";

export function fetchItems(req, res) {
  const items = getAllItems();
  res.json(items);
}
