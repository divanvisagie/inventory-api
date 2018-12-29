const express = require('express')

const router = express.Router()
const StoreModel = require('../model/store-model')
const debug = require('debug')('app:routes/store')
const log = require('../logging/log')

function createStoreService() {
    const create = async (store) => {
        const existing = await StoreModel.findOne({ name: store.name, user: store.user })
        if (!existing) {
            store.items = []
            debug('No store exist for user', store.user)
            debug('Creating new store', store)
            const result = await StoreModel.create(store)
            debug('Created', result)
            return result
        } else {
            log.info('User tried to create store they already had')
            throw Error('The user already has a store like this')
        }
    }

    const getAllForUser = async (user) => {
        debug('Getting all stores for user', user)
        const stores = await StoreModel.find({user})
        return stores
    }

    const getOne = async(storeId,userId) => {
        const result = await StoreModel.findOne({_id: storeId, user: userId})
        return result
    }

    const removeStore = async (storeId, userId) => {
        const result = await StoreModel.deleteOne({ _id: storeId, user: userId })
        debug('removed store', result)
    }

    return {
        create,
        getAllForUser,
        removeStore,
        getOne
    }
}

const storeService = createStoreService()

router.get('/', async (req,res) => {
    const stores = await storeService.getAllForUser(req.user._id)
    res.send(stores)
})

router.get('/:id', (req, res) => {
    const storeId = req.params['id']
    debug('get the details for', storeId)
    storeService.getOne(storeId, req.user._id).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).send({error: 'Unable to process request'})
    })
})

router.post('/', (req, res) => {
    const store = req.body
    store.user = req.user._id
    storeService.create(req.body).then(result => {
        res.json(result)
    }).catch(e => {
        return res.status(400)
            .send({ error: 'Unable to create store' })
    })
})

router.delete('/:id', (req,res) => {
    const storeId = req.params['id']
    debug('should delete store', storeId)
    storeService.removeStore(storeId, req.user._id).then(result => {
        res.json({ success: 'store deleted' })
    }).catch(e => {
        res.status(500).send({error: 'Failed to delete store'})
    })
})

module.exports = router