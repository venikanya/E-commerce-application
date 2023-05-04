import { useEffect, useState, useCallback } from 'react'

const usePostDatasource = () => {
    const [res, setRes] = useState({
        data: null,
        error: null,
        isLoading: false,
    })
    const callAPI = async (payload) => {
        setRes((prevState) => ({ ...prevState, isLoading: true }))
        await fetch('/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                setRes({ data, isLoading: false, error: null })
            })
            .catch((error) => {
                setRes({ data: null, isLoading: false, error })
            })
    }

    return [res, callAPI]
}

export default usePostDatasource
