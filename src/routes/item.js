const express = require('express')

const router = express.Router()

const log = require('../logging/log')
const debug = require('debug')('app:routes/item')

const StoreModel = require('../model/store-model')


function createItemService() {
    const create = async (storeId, item, userId) => {
        if (!item.count) item.count = 0
        if (item.count <= 0) item.count = 1
        const store = await StoreModel.findOne({ _id: storeId, user: userId })
        debug('found store', store)
        const itemCount = store.items.length
        const matchingItems = store.items.filter(i => i.name === item.name)
        if (matchingItems.length < 1) {
            if (itemCount < store.slots) {
                store.items.push(item)
            }
        } else {
            store.items.forEach(i => {
                if (i.name === item.name) {
                    if (!i.count) i.count = 0
                    i.count = i.count + item.count
                    
                }
            });
        }
        const result = await StoreModel.findOneAndUpdate({_id: storeId, user: userId}, store)
        if (result) {
            return store
        } 
    }

    return {
        create
    }
}


const itemService = createItemService()

router.post('/:storeId', (req, res) => {
    const item = req.body
    const storeId = req.params['storeId']
    const userId = req.user._id
    debug('adding item', item, 'to store', storeId, 'for user', userId)
    itemService.create(storeId,item,userId).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).send({error: 'Unable to add item'})
    })
})


module.exports = router