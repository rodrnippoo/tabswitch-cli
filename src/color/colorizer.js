/**
 * Assigns and manages display colors for sessions and tags.
 */

const PALETTE = [
  'red', 'green', 'yellow', 'blue', 'magenta', 'cyan',
  'redBright', 'greenBright', 'yellowBright', 'blueBright',
  'magentaBright', 'cyanBright'
];

function assignColor(name, existingColors = {}) {
  if (existingColors[name]) return existingColors[name];
  const usedColors = Object.values(existingColors);
  const available = PALETTE.filter(c => !usedColors.includes(c));
  const pool = available.length > 0 ? available : PALETTE;
  const index = Math.abs(hashString(name)) % pool.length;
  return pool[index];
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function setColor(name, color, colorMap = {}) {
  if (!PALETTE.includes(color)) {
    throw new Error(`Invalid color '${color}'. Valid colors: ${PALETTE.join(', ')}`);
  }
  return { ...colorMap, [name]: color };
}

function removeColor(name, colorMap = {}) {
  const updated = { ...colorMap };
  delete updated[name];
  return updated;
}

function getColor(name, colorMap = {}) {
  return colorMap[name] || null;
}

function listColors(colorMap = {}) {
  return Object.entries(colorMap).map(([name, color]) => ({ name, color }));
}

module.exports = {
  PALETTE,
  assignColor,
  setColor,
  removeColor,
  getColor,
  listColors
};
