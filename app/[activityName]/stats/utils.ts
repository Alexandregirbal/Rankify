const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const intToHexa = (i: number): string => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
};

export const stringToColor = (name: string): string => {
  const hash = hashString(name);
  const color = intToHexa(hash);

  return `#${color}`;
};
