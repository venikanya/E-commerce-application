import { Suspense, useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import useGetDatasource from '../hooks/useGetDatasource'
import postDatasource from '../hooks/usePostDatasource'
import usePostDatasource from '../hooks/usePostDatasource'
import SearchResults from './SearchResults'

const ListWrapper = styled.div`
    margin: 50px;
`
const ListAdd = styled.button`
    cursor: pointer;
`
const ListActions = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 10px;
`
const ListSearch = styled.div`
    padding: 0px 20px;
`

const ProductList = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dataChanged, setDataChanged] = useState()
    const [postResponse, callApi] = usePostDatasource()
    const [filter, setFilter] = useState('')
    useEffect(() => {
        if (showModal && postResponse.data) {
            setShowModal(false)
            setDataChanged(true)
        }
    }, [postResponse.data])

    const handleAddProduct = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const payload = {
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            sku: formData.get('productid'),
        }
        callApi(payload)
    }
    const handleSearch = (e) => {
        console.log(e.target.value)
        setFilter(e.target.value)
    }
    return (
        <ListWrapper>
            <ListActions>
                <ListSearch>
                    <input
                        type="search"
                        placeholder="search"
                        onChange={handleSearch}
                        id="product-search"
                        name="q"
                    />
                </ListSearch>
                <button onClick={() => setShowModal(true)}>
                    Add New Product
                </button>
            </ListActions>
            <SearchResults
                filter={filter}
                isDirty={dataChanged}
                setDataChanged={setDataChanged}
            />
            {showModal ? (
                <Modal>
                    {postResponse.error ? (
                        <p className="error">{response.error}</p>
                    ) : null}
                    <form onSubmit={handleAddProduct}>
                        <label htmlFor="productName">Product Name:</label>
                        <input type="text" name="productName" id="name"></input>

                        <label htmlFor="productCategory">
                            Product Category:
                        </label>
                        <input
                            type="text"
                            name="productCategory"
                            id="category"
                        ></input>
                        <label htmlFor="productid">Product SKU:</label>
                        <input type="text" name="productid" id="id"></input>

                        <div className="buttons">
                            <button disabled={postResponse.isLoading}>
                                Submit
                            </button>
                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </ListWrapper>
    )
}

export default ProductList
