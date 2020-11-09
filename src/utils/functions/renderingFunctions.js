

import iconSet from "@/utils/icons.js";




// RETURN STYLES AND NAMES ............
export const getTagBackground = (amount) => {
    if (Number(amount) == 0) return "tagZero";
    if (Number(amount) < 3) return "tagLow";
    return "tagGood";
  }


export const getTagTitle = (amount,itemName) => {
    if (Number(amount) == 0) return `No ${itemName} Available`;
    if (Number(amount) < 3) return `${itemName} Remaining`;
    return `${itemName} Available`;
}


// SORT DATA
export const sortByCapacity = (stationsDataArray) => {
    const sortedArray = stationsDataArray.sort(
      (a, b) => Number(b.capacity) - Number(a.capacity)
    );
    return sortedArray;
}


// RETURN HTML ELEMENTS
export const makeIcon = (iconName) => {
    return iconSet[`${iconName}`];
}