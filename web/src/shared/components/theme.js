import { platform } from './utils/platform';

const fontMonoLinux = `"Droid Sans Mono", "monospace", monospace, "Droid Sans Fallback"`;
const fontMonoWin = `Consolas, "Courier New", monospace`;
const fontMonoMac = `Menlo, Monaco, "Courier New", monospace`;

export const font = `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`

export const fonts = {
  sansSerif: font,
  mono: getMonoFont()
}

export const regular = 400;
export const bold = 600;
export const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 34];
export const fontWeights = { regular, bold };
export const space = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
export const minHeights = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80];

export const colors = {
  accent: '#FA2A6A',
  dark: '#000',
  light: '#fff',
  subtle: '#CFD8DC',
  inverse: '#B0BEC5',
  highlight: '#E1F5FE',
  link: '#039BE5',
  terminal: '#28FE14',
  terminalDark: '#18381F',

  error: '#FF1744',
  errorDark: '#D41439',
  warning: '#FF9100',
  warningDark: '#F57C00',
  info: '#039BE5',
  infoDark: '#0288D1',
  success: '#00BFA5',
  successDark: '#26A69A',

  primary: '#00BFA5',
  primaryLight: '#00EAC3',
  primaryDark: '#008A7E',

  secondary: '#0C143D',
  secondaryLight: '#222C59',
  text: '#263238',

  bgSubtle: '#f8f9fa',
  bgError: '#FEE5ED',
  bgLight: '#FFFFFF',
  bgPrimary: '#0C143D',
  bgQuaternary: '#1B234A',
  bgSecondary: '#222C59',
  bgSuccess: '#00BFA5',
  bgTerminal: '#010B1C',
  bgTertiary: '#263266',
}

export const borders = [
  0,
  '1px solid',
  '2px solid',
  '4px solid',
  '8px solid',
  '16px solid',
  '32px solid',
];

const theme = {
  colors,
  fontSizes,
  font,
  fontWeights,
  space,
  minHeights: space,
  borders,
  regular,
  bold,
  // disabled media queries for style-system
  breakpoints: []
}

export default theme;

function getMonoFont() {
  if (platform.isLinux) {
    return fontMonoLinux;
  }

  if (platform.isMac) {
    return fontMonoMac;
  }

  if (platform.isWin) {
    return fontMonoWin;
  }

  return fontMonoLinux;
}