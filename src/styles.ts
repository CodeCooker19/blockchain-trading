import backgroundRight from "./assets/background-right.png";
import backgroundDark from "./assets/background-dark.png";
const darkMode = localStorage.getItem('darkMode');
const isDarkMode = darkMode === 'true' ? true : false;

export const colors = {
  white: isDarkMode ? '0, 0, 0' : '255, 255, 255',
  black: isDarkMode ? '255, 255, 255' : '0, 0, 0',
  dark: '12, 12, 13',
  grey: '169, 169, 188',
  brandGrey: '112,112,112',
  darkGrey: isDarkMode ? '113, 119, 138' : '212, 212, 212',
  lightGrey: isDarkMode ? '212, 212, 212' : '113, 119, 138',
  blue: '0, 103, 206',
  lightBlue: '64, 153, 255',
  fadedBlue: '0,89,163',
  yellow: '250, 188, 45',
  orange: '255, 119, 0',
  green: '84, 209, 146',
  pink: '255, 51, 102',
  red: '214, 0, 0',
  fadedRed: '165,0,0',
  borderRed: '#D60000',
  navBackground: '#E9E9E9',
  navFontColor: '#A7A7A7',
  navActiveFontColor: '#707070',
  connectButtonColor: '#0067CE',
  purple: '110, 107, 233',
  // text
  text1: isDarkMode ? '#FFFFFF' : '#000000',
  text2: isDarkMode ? '#C3C5CB' : '#565A69',
  text3: isDarkMode ? '#6C7284' : '#888D9B',
  text4: isDarkMode ? '#565A69' : '#C3C5CB',
  text5: isDarkMode ? '#2C2F36' : '#EDEEF2',
  text6: isDarkMode ? '#000000' : '#FFFFFF',

  // backgrounds / greys
  bg1: isDarkMode ? '#212429' : '#FFFFFF',
  bg2: isDarkMode ? '#2C2F36' : '#F7F8FA',
  bg3: isDarkMode ? '#40444F' : '#EDEEF2',
  bg4: isDarkMode ? '#565A69' : '#CED0D9',
  bg5: isDarkMode ? '#6C7284' : '#888D9B',

  //specialty colors
  modalBG: isDarkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
  advancedBG: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
  shadow1: isDarkMode ? '#000' : '#2F80ED',

  //primary colors
  primary1: isDarkMode ? '#2172E5' : '#ff007a',
  primary2: isDarkMode ? '#3680E7' : '#FF8CC3',
  primary3: isDarkMode ? '#4D8FEA' : '#FF99C9',
  primary4: isDarkMode ? '#376bad70' : '#F6DDE8',
  primary5: isDarkMode ? '#153d6f70' : '#FDEAF1',

  // color text
  primaryText1: isDarkMode ? '#6da8ff' : '#ff007a',

  // secondary colors
  secondary1: isDarkMode ? '#2172E5' : '#ff007a',
  secondary2: isDarkMode ? '#17000b26' : '#F6DDE8',
  secondary3: isDarkMode ? '#17000b26' : '#FDEAF1',

  // other
  red1: '#FD4040',
  red2: '#F82D3A',
  red3: '#D60000',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  blue1: '#2172E5',
}

export const fonts = {
  size: {
    tiny: '10px',
    small: '14px',
    medium: '16px',
    large: '18px',
    h0: '80px',
    h1: '60px',
    h2: '50px',
    h3: '40px',
    h4: '32px',
    h5: '24px',
    h6: '20px'
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  family: {
    OpenSans: '"Open Sans", sans-serif'
  }
}

export const transitions = {
  short: 'all 0.1s ease-in-out',
  base: 'all 0.2s ease-in-out',
  long: 'all 0.3s ease-in-out',
  button: 'all 0.15s ease-in-out'
}

export const shadows = {
  soft:
    '0 4px 6px 0 rgba(50, 50, 93, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)',
  medium:
    '0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(50, 50, 93, 0.02), 0 5px 10px 0 rgba(59, 59, 92, 0.08)',
  big:
    '0 15px 35px 0 rgba(50, 50, 93, 0.06), 0 5px 15px 0 rgba(50, 50, 93, 0.15)',
  hover:
    '0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)'
}

export const responsive = {
  xs: {
    min: 'min-width: 467px',
    max: 'max-width: 468px'
  },
  sm: {
    min: 'min-width: 639px',
    max: 'max-width: 640px'
  },
  md: {
    min: 'min-width: 959px',
    max: 'max-width: 960px'
  },
  lg: {
    min: 'min-width: 1023px',
    max: 'max-width: 1024px'
  },
  xl: {
    min: 'min-width: 1399px',
    max: 'max-width: 1400px'
  }
}

export const globalStyle = `
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700,800');

  html {
    background: url(${isDarkMode ? backgroundDark : backgroundRight}) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    overflow-x: hidden;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }



  @-webkit-keyframes spin {
    0%  {-webkit-transform: rotate(0deg);}
    100% {-webkit-transform: rotate(360deg);}   
}

  body {
    font-family: ${fonts.family.OpenSans};
    font-style: normal;
    font-stretch: normal;
    font-weight: ${fonts.weight.normal};
    font-size: ${fonts.size.medium};
    color: rgb(${colors.dark});
    # overflow-y:auto;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  	-webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;  
    position: relative;
  }

  button {
    border-style: none;
    line-height: 1em;
    background-image: none;
    outline: 0;
    -webkit-box-shadow: none;
            box-shadow: none;
  }

  [tabindex] {
    outline: none;
    width: 100%;
    height: 100%;
  }

  a, p, h1, h2, h3, h4, h5, h6 {
  	text-decoration: none;
  	margin: 0;
    padding: 0;
    margin: 0.7em 0;
  }

  h1 {
    font-size: ${fonts.size.h1}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }
  h2 {
    font-size: ${fonts.size.h2}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }
  h3 {
    font-size: ${fonts.size.h3}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }
  h4 {
    font-size: ${fonts.size.h4}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }
  h5 {
    font-size: ${fonts.size.h5}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }
  h6 {
    font-size: ${fonts.size.h6}
    color: rgb(${isDarkMode ? colors.white : colors.black})
  }

  a {
    background-color: transparent;
    -webkit-text-decoration-skip: objects;  
    text-decoration: none;
    color: inherit;
    outline: none;
  }

  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  ul, li {
  	list-style: none;
  	margin: 0;
  	padding: 0;
  }

  * {
   # box-sizing: border-box !important;
  }


  input {
    -webkit-appearance: none;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
  }
  audio,
  canvas,
  progress,
  video {
    display: inline-block;
  }

  input[type="color"],
  input[type="date"],
  input[type="datetime"],
  input[type="datetime-local"],
  input[type="email"],
  input[type="month"],
  input[type="number"],
  input[type="password"],
  input[type="search"],
  input[type="tel"],
  input[type="text"],
  input[type="time"],
  input[type="url"],
  input[type="week"],
  select:focus,
  textarea {
    font-size: 16px;
  }
`
