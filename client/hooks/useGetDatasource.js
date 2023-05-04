import { useState, useEffect } from 'react'

const useGetDatasource = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const getProducts = async (filterText) => {
        setLoading(true)
        const searchQuery = filterText ? `?filter=${filterText.trim()}` : ''
        const response = await fetch(`/api/products${searchQuery}`)
        const data = await response.json()
        setData(data)
        setLoading(false)
    }

    return [data, loading, getProducts]
}

export default useGetDatasource
