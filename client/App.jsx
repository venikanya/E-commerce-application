import { createRoot } from 'react-dom/client'
import './App.css'
import ProductList from './components/ProductList'
const App = () => {
    return (
        <div className="App">
            <h1>Search Our Catalog</h1>
            <ProductList />
        </div>
    )
}

const container = document.getElementById('root')

createRoot(container).render(<App />)
