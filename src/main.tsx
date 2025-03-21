import ReactDOM from 'react-dom/client'
import App from './App'
import {GlobalStyles} from './styles/GlobalStyles';
import './assets/fonts/GT-America-Mono-Regular.woff2'
import './assets/fonts/GT-America-Standard-Bold.woff2'
import './assets/fonts/GT-America-Standard-Medium.woff2'
import './assets/fonts/GT-America-Standard-Regular.woff2'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <>
    <GlobalStyles></GlobalStyles>
    <App />
    </>
)
