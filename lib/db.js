var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    item   = new Schema({
              msg   : String,
              link  : { type: String, required: true },
              title : String,
              desc  : String,
              date  : { type: Date, required: true , default: Date()}
           });

mongoose.connect('localhost','awesome');
var Item = mongoose.model('item',item);

module.exports.create = function(data,cb) {

  if( data['_id'] ) delete data._id;

  //TODO validate input or add validators to schema
  new Item(data).save(cb);
}

module.exports.remove = function(id,cb) {
  Item.remove({_id:id},cb);
}

module.exports.update = function(data,cb) {
  var id = data.id;
  Item.update({_id:id},data,cb);
}

module.exports.fetch = function(start,limit,cb) {
  if(typeof start == 'function') {
    cb = start;
    start = undefined;
  }

  if(start == undefined ) {
    Item.find().run(cb);
  }else{
    Item.find().skip(start).limit(limit).sort('date',1).run(cb);
  }
}
