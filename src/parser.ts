import luaparse from 'luaparse';
import { unitNamesAndCards } from './data/unitNamesAndCards.js';
import { encode } from 'blurhash';

const WH3_UNITS_KEY = 'wh3_units';
const WH2_UNITS_KEY = 'wh2_units';
const WH3_ROR_UNITS_KEY = 'wh3_ror';

const WANTED_ORDER = { core: 1, special: 2, rare: 3 };

export const parseFile = (rawText) => {
  const ast = luaparse.parse(rawText);
  const units = [
    ...parseUnits(ast, WH3_UNITS_KEY),
    ...parseUnits(ast, WH2_UNITS_KEY),
    ...parseUnits(ast, WH3_ROR_UNITS_KEY),
  ];

  const data = [];

  units.forEach((unit) => {
    // todo - do this in one loop some day
    if (!data.some((list) => list.faction === unit.faction)) {
      data.push({ faction: unit.faction, units: [] });
    }

    const toMutate = data.find((list) => list.faction === unit.faction);
    toMutate.units.push(unit);
  });

  // Sort all units, core => special => rare
  data.forEach((faction) => {
    faction.units.sort((a, b) => {
      if (a.type === b.type) {
        return a.cost - b.cost;
      }

      return WANTED_ORDER[a.type] - WANTED_ORDER[b.type];
    });
  });

  return data;
};

/***
 * Groups them all into one array
 */
export const parseUnits = (ast, key) => {
  try {
    const subIdentifier = ast.body.filter((item) => item.variables?.[0].name === key);
    const unitKeyCost = subIdentifier[0].init[0].fields.map((field) => {
      const unitKey = field.value.fields[0].value.raw.replaceAll('"', '');
      const type = field.value.fields[1].value.raw.replaceAll('"', '');
      const cost = field.value.fields?.[2]?.value.raw.replaceAll('"', '');
      return { unitKey, type, cost };
    });

    const withFactionAndUnitName = unitKeyCost.map((item) => {
      return {
        ...item,
        faction: getFaction(item.unitKey),
        name: getUnitName(item.unitKey),
        card: getUnitCard(item.unitKey),
        additionalNotes: getAdditionalNotes(item.unitKey),
        blurHash: getBlurHash(item.unitKey),
        hidden: getHidden(item.unitKey),
      };
    });

    return withFactionAndUnitName.filter((unit) => !unit.hidden);
  } catch (e) {
    console.error('Failed to parse');
    console.error(e);
    return [];
  }
};

const getFaction = (unitKey) => {
  if (unitKey.includes('_kho_')) {
    return 'Khorne';
  }

  if (unitKey.includes('_cth_')) {
    return 'Cathay';
  }

  if (unitKey.includes('_ksl_')) {
    return 'Kislev';
  }

  if (unitKey.includes('_nur_')) {
    return 'Nurgle';
  }

  if (unitKey.includes('_ogr_')) {
    return 'Ogre Kingdoms';
  }

  if (unitKey.includes('_sla_')) {
    return 'Slaanesh';
  }

  if (unitKey.includes('_tze_')) {
    return 'Tzeentch';
  }

  if (unitKey.includes('_dae_')) {
    return 'Chaos Undivided';
  }

  if (unitKey.includes('_emp_') || unitKey.includes('_huntmarshall_')) {
    return 'Empire';
  }

  if (unitKey.includes('_dwf_')) {
    return 'Dwarf';
  }

  if (unitKey.includes('_vmp_')) {
    return 'Vampire Counts';
  }

  if (unitKey.includes('_brt_')) {
    return 'Bretonnia';
  }

  if (unitKey.includes('_grn_')) {
    return 'Greenskins';
  }

  if (unitKey.includes('_chs_')) {
    return 'Chaos Warriors';
  }

  if (unitKey.includes('_chs_')) {
    return 'Chaos Warriors';
  }

  if (unitKey.includes('_bst_')) {
    return 'Beastmen';
  }

  if (unitKey.includes('_wef_')) {
    return 'Wood Elves';
  }

  if (unitKey.includes('_nor_')) {
    return 'Norsca';
  }

  if (unitKey.includes('_lzd_')) {
    return 'Lizardmen';
  }

  if (unitKey.includes('_skv_')) {
    return 'Skaven';
  }

  if (unitKey.includes('_hef_')) {
    return 'High Elves';
  }

  if (unitKey.includes('_def_')) {
    return 'Dark Elves';
  }

  if (unitKey.includes('_tmb_')) {
    return 'Tomb Kings';
  }

  if (unitKey.includes('_cst_')) {
    return 'Vampire Coast';
  }

  return 'Unknown';
};

const getUnitName = (unitKey) => {
  try {
    return unitNamesAndCards[unitKey].name;
  } catch (e) {
    console.log('no unit name for: ', unitKey);
  }
};

const getUnitCard = (unitKey) => {
  try {
    return unitNamesAndCards[unitKey].card_path;
  } catch (e) {
    console.log('no card path for: ', unitKey);
  }
};

const getAdditionalNotes = (unitKey) => {
  return unitNamesAndCards[unitKey]?.additionalNotes || null;
};

const getBlurHash = (unitKey) => {
  try {
    return unitNamesAndCards[unitKey].blurHash;
  } catch (e) {
    console.log('no blurHash for: ', unitKey);
  }
};

const getHidden = (unitKey) => {
  try {
    return unitNamesAndCards[unitKey].hidden;
  } catch (e) {}
};

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });
};

const getImageData = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async (imageUrl) => {
  const image = await loadImage(imageUrl);
  const imageData = getImageData(image);
  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};
