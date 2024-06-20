import uniqueCities from '../data/unique-cities.json';
import uniqueProvinces from '../data/unique-provinces.json';
import charityCategories from '../data/category-map.json';
import charitySubcategories from '../data/subcategory-map.json';

export const operators = [
  "$eq",
  "$ne",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
];

// $eq - Equal to (number, string, boolean)
// $ne - Not equal to (number, string, boolean)
// $gt - Greater than (number)
// $gte - Greater than or equal to (number)
// $lt - Less than (number)
// $lte - Less than or equal to (number)
// $in - In array (string or number)
// $nin - Not in array (string or number)
// $exists - Has the specified metadata field (boolean)

export const getUniqueCities = () => uniqueCities.sort((a, b) => a.name.localeCompare(b.name));
export const getUniqueProvinces = () => uniqueProvinces;
export const getCharityCategories = () => charityCategories;
export const getCharitySubcategories = () => charitySubcategories;