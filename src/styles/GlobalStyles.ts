import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}


nextjs-portal, next-route-announcer {
  display: none;
}

.progress-bar-wrapper {
  width: 100%;
  min-width: 400px;
  max-width: 800px;
  height: 10px;
  padding: 2px;
  background-color: #959595;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;

  .progress-bar {
    width: 0%;
    background-color: #44d4d9;
  }
}

.page {
  --gray-rgb: 0, 0, 0;
  --gray-alpha-200: rgba(var(--gray-rgb), 0.08);
  --gray-alpha-100: rgba(var(--gray-rgb), 0.05);

  --button-primary-hover: #383838;
  --button-secondary-hover: #f2f2f2;

  min-height: 100svh;
  padding: 40px 40px;
  font-family: var(--font-geist-sans);
}

@media (prefers-color-scheme: dark) {
  .page {
    --gray-rgb: 255, 255, 255;
    --gray-alpha-200: rgba(var(--gray-rgb), 0.145);
    --gray-alpha-100: rgba(var(--gray-rgb), 0.06);

    --button-primary-hover: #ccc;
    --button-secondary-hover: #1a1a1a;
  }
}


.main {
  display: flex;
  flex-direction: column;
  gap: 32px;
  grid-row-start: 2;
}

.main ol {
  font-family: var(--font-geist-mono);
  padding-left: 0;
  margin: 0;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.01em;
  list-style-position: inside;
}

.main li:not(:last-of-type) {
  margin-bottom: 8px;
}

.main code {
  font-family: inherit;
  background: var(--gray-alpha-100);
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

.header {

}

.dropzone {
  margin: 0 auto;
  padding: 20px;
  cursor: pointer;
  height: 300px;
  width: 300px !important;
  border: 1px solid #8c8c8c;
  border-radius: 20px;
  display: flex;


  * {
    margin: auto;
    text-align: center;
  }
}

.over {
  background-color: #383838;
}

.controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;

  button {
    cursor: pointer;
    margin: auto 0 0;
    padding: 0 20px;
    border-radius: 8px;
    height: 50px;
    display: flex;

    span {
      margin: auto;
    }
  }
  
  .input-wrapper {
    display: flex;
    flex-direction: column;
  }

  input {
    margin-bottom: 10px;
    padding: 8px 16px;
    width: 100%;
  }

  
}

.fileName {
  text-align: center;
}

.MuiTabs-list {
  width: 100%;

  .MuiTab-root {
    color: white;
    cursor: pointer;

    &.Mui-selected {
      color: #1976d2;
    }

    &.Mui-disabled {
      opacity: 0.5;
    }
  } 
}

.result-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: no-wrap;
  gap: 10px;

  .parse-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: auto 0;

    .input-container {
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      input {
        margin: auto;
        width: 100px;
      }
    }

    button {
      margin: auto;
      width: 100%;
    }
  }

  .right-side,
  .left-side {
    min-width: 40%;
    flex: 1;

    .right-side-header,
    .left-side-header {
      margin: 0 auto;
    }


    .right-side-container,
    .left-side-container {
      border: 1px solid gray;
      border-radius: 10px;
      padding: 10px;
      height: 100%;
    }

    .preview {
      display: flex;
      width: 100%;
      justify-content: space-between;
      flex-wrap: nowrap;

      .ua {
        max-width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .ip {
        width: 50%;
        min-width: 150px;
      }
    }
  }
}
`;
