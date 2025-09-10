const Product = require('../models/product')
const Order = require('../models/order');

const cloudinary = require('cloudinary')

exports.newProduct = async (req, res, next) => {
console.log(req.files)
	let images = []
	if (typeof req.files === 'string') {
		images.push(req.files)
	} else {
		images = req.files
	}

	let imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		try {
			const result = await cloudinary.v2.uploader.upload(images[i]['path'], {
				folder: 'products',
				width: 150,
				crop: "scale",
			});

			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})

		} catch (error) {
			console.log(error)
		}

	}

	req.body.images = imagesLinks
	// req.body.user = req.user.id;

	const product = await Product.create(req.body);

	if (!product)
		return res.status(400).json({
			success: false,
			message: 'Product not created'
		})


	return res.status(201).json({
		success: true,
		product
	})
}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    return res.status(200).json({
        success: true,
        product
    })
}

exports.getAdminProducts = async (req, res, next) => {

    const products = await Product.find();
    if (!products) {
        return res.status(404).json({
            success: false,
            message: 'Products not found'
        })
    }
    return res.status(200).json({
        success: true,
        products
    })

}

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    // console.log(req.body)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    let images = []

    if (typeof req.files === 'string') {
        images.push(req.files)
    } else {
        images = req.files
    }
    console.log(images)
 
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i]['path'], {
            folder: 'products',
            width: 150,
            crop: "scale",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }
    req.body.images = imagesLinks
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })
    // console.log(product)
    return res.status(200).json({
        success: true,
        product
    })
}
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
}

exports.getProducts = async (req, res) => {

    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const products = await Product.find()
    if (!products)
        return res.status(400).json({ message: 'error loading products' })
    
    return res.status(200).json({
        success: true,
        products,
        resPerPage,
        productsCount,

    })
}







