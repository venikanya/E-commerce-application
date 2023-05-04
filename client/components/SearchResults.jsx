import styled from 'styled-components'
import { useEffect } from 'react'
import useGetDatasource from '../hooks/useGetDatasource'

const ListContainer = styled.div`
    border: 2px solid black;
    height: calc(80vh - 100px);
    margin: auto;
}
`
const ListItemInnerContainer = styled.div`
    justify-content: flex-start;
    align-content: start;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: wrap;
    overflow: scroll;
    border: 0;
`
const ListItem = styled.div`
    border: 1px solid grey;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 10px;
    width: 120px;
    height: 120px;
    margin: 10px;
    p {
        margin: 0;
        overflow-wrap: break-word;
    }
`
const SearchResults = ({ filter, isDirty, setDataChanged }) => {
    const [data, isLoading, getProducts] = useGetDatasource()

    useEffect(() => {
        getProducts(filter)
    }, [filter])

    useEffect(() => {
        if (isDirty) {
            getProducts(filter)
            setDataChanged(false)
        }
    }, [isDirty])

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <ListContainer>
            {data.length === 0 ? <p>No Products</p> : null}
            {data.length > 0 ? (
                <ListItemInnerContainer>
                    {data.map((item) => (
                        <ListItem key={item.sku}>
                            <h4>{item.name}</h4>
                            <p>Category: {item.category}</p>
                            <p>SKU: {item.sku}</p>
                        </ListItem>
                    ))}
                </ListItemInnerContainer>
            ) : null}
        </ListContainer>
    )
}

export default SearchResults
