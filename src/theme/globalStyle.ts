import { createGlobalStyle } from 'styled-components/macro';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
  }

  #root,
  #root > * {
    width: 100%;
    height: 100%;
  }

  body {
    padding: 0;
    margin: 0;
    font-family: ${props => props.theme.config.fontFamily}, Arial, sans-serif;
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5 {
    max-width: 20em;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    font-family: ${props => props.theme.config.fontFamily}, Arial, sans-serif;
  }

  ul,
  ol {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  
  input {
    max-width: 30em;
  }
  
  p {
    max-width: 50em;
  }
`;

export default GlobalStyle;
