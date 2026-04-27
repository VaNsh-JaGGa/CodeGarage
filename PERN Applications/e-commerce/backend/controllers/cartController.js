const {Cart,Product} = require("../models/index.js");

//Controller for add an item in the cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findByPk(productId);
        if (!product){
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock < 1) {
            return res.status(400).json({ message: "Product is out of stock" });
        }
        // basically ye check kr rha hai ki same product already cart me hai ya nhi 
        const existingItem = await Cart.findOne({
            where: { buyerId: req.user.id, productId },
        });
        if (existingItem) {
            existingItem.quantity += quantity || 1;
            await existingItem.save();
            return res.status(200).json({ message: "Quantity updated", cartItem: existingItem });
        }
        // product is not in cart, Creating new cart 
        const cartItem = await Cart.create({
            buyerId: req.user.id,
            productId,
            quantity: quantity || 1,
        });

        return res.status(201).json({ message: "Added to cart", cartItem });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ message: "Failed to add to cart" });
    }
};

// Controller for remove an Item from the cart
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await Cart.findOne({
            where: { id, buyerId: req.user.id },
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await cartItem.destroy(); //delete thus current row from the Cart model.
        return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Remove cart item error:", error);
        return res.status(500).json({ message: "Failed to remove item" });
    }
};

// Controller to clear the Complete cart of the buyer
const clearCart = async(req,res) =>{
    try{
        await Cart.destroy(
            {where:{buyerId:req.user.id}}
        )
        return res.status(200).json({message:"Cart Cleared"});
    }
    catch(err){
        return res.status(500).json({message:"Failed to lear Cart"});
    }
}

// Controller to update the quantity of an cart
const updatecartItem = async (req,res) =>{
    try{
        const {id} = req.params;
        const {quantity} = req.body;
        if(!quantity || quantity < 1){
            return res.status(400).json({message:"quantity must be atleast 1"})
        }
        // find the cart Item
        const cartItem = await Cart.findOne(
            {where:{
                id,                  // it is the cart item id
                buyerId:req.user.id  // it should belonged to the logged in user.
            }}
        )
        if(!cartItem){
            return res.status(404).json({message:"Cart Item not Found"})
        }
        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({message:"Cart Updated Successfully"})
    }
    catch(error){
        console.log("cart Update Error",error);
        return res.status(500).json({message:"Failed to update Cart"})
    }
}


//return all carts for the logged in user
const getCart = async (req,res) => {
    try{
        const cartItems = await Cart.findAll({
            where: { buyerId: req.user.id },
            include: [{
                model: Product,
                as: "product",
                attributes: ["id", "name", "price", "stock", "image_url"]
            },],
        });

        //now try to find out the total price of the cart using the reduce method of array
        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + parseFloat(item.product.price) * item.quantity;
        }, 0)

        //return the response
        return res.status(200).json({
            cartItems,
            totalPrice: totalPrice.toFixed(2),
        })
    }

    catch(err){
        console.log("get cart error",err);
        res.status(500).json({
            message:"Failed to fetch Cart",
        })
    }
}

module.exports = {addToCart,removeFromCart,clearCart,updatecartItem,getCart};