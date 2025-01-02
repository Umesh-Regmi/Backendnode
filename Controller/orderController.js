const OrderItems = require('../models/orderItemsModel')
const Order = require('../models/orderModel')


// place order
exports.placeOrder = async (req, res) => {
    // store order items in OrderItemsModel
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let orderItems = await OrderItems.create({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            if (!orderItems) {
                return res.status(400).json({ error: "Something went wrong" })
            }
            return orderItems._id
        })
    )
    // calculate total 
    // calculate individual totals
    let individual_totals = await Promise.all(
        orderItemsIds.map(async orderItem => {
            let order_item = await OrderItems.findById(orderItem).populate('product', 'price')
            return order_item.product.price * order_item.quantity
        })
    )
    let total = individual_totals.reduce((acc, cur) => acc + cur)
    let order = await Order.create({
        orderItems: orderItemsIds,
        total: total,
        user: req.body.user,
        contact_person: req.body.contact_person,
        street: req.body.street,
        city: req.body.city,
        postal_code: req.body.postal_code,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone
    })
    if (!order) {
        return res.status(400).json({ error: "Failed to place order" })
    }
    res.send(order)
}