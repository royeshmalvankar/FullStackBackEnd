const express = require('express')
const Product = require('../model/product.model')
const auth = require('../middleware/auth.middleware')

const productrouter = express.Router()

productrouter.get('/',auth('admin','seller','buyer'), async(req, res) => {
    try {
        if(req.user.role == "admin"||req.user.role == "buyer"){
        const products = await Product.find()
        res.status(200).send({"products":products})
        }
        else{
            const products = await Product.find({sellerId:req.user.id})
            res.status(200).send({"products":products})
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({"error":error})
    }
})

productrouter.get('/search',auth('admin','seller','buyer'), async(req, res) => {
    var {name,price,min,max,page=1,limit=10,order="asc",sortby} = req.query
    try {
    let query = {}
    if(name)
    {
        query.name = { $regex: name, $options: 'i' }
    }
    if(price)
    {
        query.price = {$gte: min, $lte: max }
    }
    let sortquery = {}
    if(sortby)
    {
        sortquery[sortby] = order==="asc"?1:-1
    }
    
    page = parseInt(page)
    limit = parseInt(limit)
    let skip = (page-1)*limit
  
        const products = await Product.find(query).sort(sortquery).skip(skip).limit(limit)
        res.status(200).send({"products":products})
    } catch (error) {
        console.log(error);
        res.status(400).send({"error":error})
    }
})

productrouter.get('/:id',auth('admin','seller','buyer'), async (req, res) => {
  try {
      const product = await Product.findById(req.params.id)
      if(!product)
      {
          return res.status(400).send({message:"product not found"})
      }
      res.status(200).send({"product":product})

  } catch (error) {
    console.log(error);
    res.status(400).send({"error":error})
  }
})

productrouter.post('/add',auth('admin','seller'), (req, res) => {
    const { name, description, price, quantity } = req.body
    if (!name ||  !price || !quantity) {
        return res.status(400).send({message:"please enter fields"})
    }
    try {
        const product = new Product({
            name,
            description,
            price,
            quantity,
            sellerId : req.user.id
    })
        product.save()
        res.status(200).send({message:"product added successfully","product":product})
    } catch (error) {
        console.log(error);
        res.status(400).send({message:"product not added","error":error})    
    }
})

productrouter.patch('/update/:id',auth('admin','seller'),async (req, res) => {
    const id = req.params.id
    const { name, description, price, quantity } = req.body
    if (req.body == null) {
        return res.status(400).send({message:"please enter fields"})
    }
    try {
        const productCheck = await Product.findById(id)
        if(!productCheck)
        {
            return res.status(400).send({message:"product not found"})
        }
        if(req.user.role == "admin"){  
        const product = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price,
            quantity
        })
        res.status(200).send({message:"product updated successfully",product:product})
        }else{
            if(productCheck.sellerId != req.user.id)
                {
                    return res.status(400).send({message:"you are not authorized to update this product"})
                }    
            const productseller = await Product.findByIdAndUpdate(id, {
                name,
                description,
                price,
                quantity
            })
        
        res.status(200).send({message:"product updated successfully",product:productseller})
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message:"product not updated",error:error})
    }
})

productrouter.delete('/delete/:id',auth('admin','seller'), async(req, res) => {
    const id = req.params.id
    const productCheck = await Product.findById(id)
    try {
        if(req.user.role == "admin"){  
        const product = await Product.findByIdAndDelete(id)
        res.status(200).send({message:"product deleted successfully","product":product})
        }else{
            if(productCheck.sellerId != req.user.id)
                {
                    return res.status(400).send({message:"you are not authorized to delete this product"})
                }    
            const productseller = await Product.findByIdAndDelete(id)
        
        res.status(200).send({message:"product deleted successfully","product":productseller})
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message:"product not deleted","error":error})
    }
})

module.exports = productrouter