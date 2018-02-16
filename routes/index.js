const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

// Add additional routes below:
router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.get('/items/:itemId', async (req, res, next) => {
  const item = await Item.findById(req.params.itemId);
  res.render('single-item', {item});
});

router.get('/items/:itemId/update', async (req, res, next) => {
  const item = await Item.findById(req.params.itemId);
  res.render('update', {item});
});

router.post('/items/create', async (req, res) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if(newItem.errors){
    res.status(400).render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }
});

router.post('/items/:itemId/update', async (req, res) => {
  const {title, description, imageUrl} = req.body;
  const item = await Item.findById(req.params.itemId);
  if(item.errors) {
    res.status(400).render('update', {item: item});
  } else {
    await Item.update({_id: item._id}, {title, description, imageUrl});
    res.redirect(`/items/${item._id}`);
  }
});

router.post('/items/:itemId/delete', async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  await Item.remove({_id: item._id})
  res.redirect('/');
});



module.exports = router;
