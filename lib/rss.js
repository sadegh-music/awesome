var db  = require('./db'),
    RSS = require('rss');

var feed,xmlCache,cacheInvaidate = true, LENGTH = 20;

var init = exports.init = function(cb){
    
    feed = new RSS({
        title: 'سامانه همرها پیچک',
        description: 'فید شرکت سامانه همراه پیچک، تولید و صادر کننده نرم افزار در حوزه گوشی های هوشمند.',
        feed_url: 'http://pichack.co/rss.xml',
        site_url: 'http://pichak.co',
        image_url: 'http://pichak.co/img/logo2.png',
        author: 'Pichak Co.'
    });

    db.fetch(0,LENGTH,function(err,items){

        if( err ) {
            cb(err)
        }

        items.forEach(function(item){
            addItem(item);
        });

        cb(null,feed);
    });

}

var addItem = exports.addItem = function(item){

    cacheInvalidate = true;

    if( feed.items.length >= LENGTH ) {
        feed.items.shift();
    }

    feed.item({
        title:  item.title,
        description: item.msg,
        url: item.link, // link to the item
        guid: item._id, // optional - defaults to url
        author: 'Pichak Co.', // optional - defaults to feed author property
        date: item.date // any format that js Date can parse.
    });

}

var generate = exports.generate = function(indent){

    if( cacheInvalidate ) {
        xmlCache = feed.xml(indent);
        cacheInvalidate = false;
    }

    return xmlCache;
}
