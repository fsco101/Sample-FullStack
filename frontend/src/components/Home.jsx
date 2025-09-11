import React, { useState, useEffect } from 'react'

import axios from 'axios'
import Product from './Product/Product'
import MetaData from './Layout/MetaData'
import Loader from './Layout/Loader'

const Home = () => {
    const [products, setProducts] = useState([])
    const [productsCount, setProductsCount] = useState(0)
    const [resPerPage, setResPerPage] = useState(0)
    const [loading, setLoading] = useState(true)

    const getProducts = async () => {
        let link = `http://localhost:4001/api/v1/products`

        let res = await axios.get(link)
        console.log(res)
        setProducts(res.data.products)
        setProductsCount(res.data.productsCount)

        setResPerPage(res.data.resPerPage)
        setLoading(false)
    }

    useEffect(() => {
        getProducts()
    }, []);
    return (
        <>
            <MetaData title={'Buy Best Products Online'} />
            {loading ? <Loader /> : (<div className="container container-fluid">
                <h1 id="products_heading">Latest Products</h1>
                <section id="products" className="container mt-5">
                    <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                </section>


            </div>)}

        </>

    )
}

export default Home