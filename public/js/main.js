(function(){

  var cursor = 0;

  function initialize(){

    $(window).scroll(function(){
      var totalHeight = $(document).height() - $(window).height();
      var scrollTop = $(this).scrollTop() + 10;
      if( scrollTop >= totalHeight ){
        if($('.loading').length == 0){
          loadItems();
        }
      }
    });

    $('#share-btn').click(function(){
       if(window.webkitNotifications && window.webkitNotifications.checkPermission()) window.webkitNotifications.requestPermission();
    });
    $('#remove-modal').modal({backdrop:false,keyboard:false});

    $('#items').delegate('.remove','click',function(){
      $('#removeId').val($(this).parent().attr('id'));
      $('#remove-modal').modal();
    });

    $('#yes-btn').click(function(){

      if($(this).hasClass('disabled')) return;

      $(this).addClass('disabled');
      $('#no-btn').addClass('disabled');

      removeItem($('#removeId').val(),function(err){

        $('#yes-btn').removeClass('disabled');
        $('#no-btn').removeClass('disabled');

        if(err){
          $('#remove-error').show();
        }else{
          $('#remove-error').hide();
          $('#remove-modal').modal();
        }
        
      });

    });

    $('#no-btn').click(function(){

      if($(this).hasClass('disabled')) return;

      $('#remove-error').hide();
      $('#remove-modal').modal();
    });

    $('#save-btn').click(function(){
    
      if($(this).hasClass('disabled')) return;

      $('#save-btn').addClass('disabled');
      $('#cancel-btn').addClass('disabled');
        
      $('#share-error').hide();

      var data = {
        msg: $('#msg').val(),
        link: $('#link').val()
      }

      shareItem(data,function(err){

        $('#save-btn').removeClass('disabled');
        $('#cancel-btn').removeClass('disabled');
        
        if(err){
          $('#share-error').show();
        }else{
          $('#share-error').hide();
          $('#modal').modal();
        }

      });

    });

    $('#cancel-btn').click(function(){
      
      if($(this).hasClass('disabled')) return;

      $('#share-error').hide();
      $('#modal').modal();
    });

  }

  function itemsLoaded(items){
    var template = '<div id="%_id%" class="item">\
                      <a href="#" class="remove">x</a>\
                      <div class="msg">%msg%</div>\
                      <div class="title">\
                        <a href="%link%" target="_blank">%title%</a>\
                      </div>\
                      <div class="desc">%desc%</div>\
                    </div>';
    
    $('.loading').remove();
    var temp;
    items.forEach(function(item){
      temp = template.replace(/%(.{2,5})%/g,function(substr,index){
        return item[index];
      });
      $('#items').prepend(temp);
    });

    if(items.length > 0){
      notifyUser(items[0],items.length);
    }
  }

  function notifyUser(item,count){
    if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
      var notification = window.webkitNotifications.createNotification(null,item.title,item.desc);
      notification.show();
      if(count > 1){
        notification = window.webkitNotifications.createNotification(null,'More links shared...',--count +' more items loaded');
        notification.show();
      }
    }
  }

  function itemRemoved(id){
    $('#'+id).hide().remove();
  }

  function shareItem(data,callback){
    now.share(data,function(err){
      callback(err);
    });
  }

  function removeItem(id,callback){
    now.remove(id,function(err){
      callback(err);
    });
  }

  function loadItems(){
    $('#items').after('<div class="loading"/>');
    $('.load-error').remove();
    now.load(cursor++,function(err){
      if(err){
        $('#items').append('<div class="load-error">Error loading shared items. Trying in 10 seconds...</div>');
        $('.loading').remove();
        cursor--;
        setTimeout(loadItems,10000);
      }
    });
  }

  $(document).ready(function(){

    initialize();
    now.onItem = itemsLoaded;
    now.onRemove = itemRemoved;
    
    now.ready(function(){
      loadItems();
    });

  });

})();
