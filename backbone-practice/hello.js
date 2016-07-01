
$(function(){
  //将一个集合的状态持久到服务器，是backbone每次向服务器读取或保存模型都要执行的函数
  Backbone.sync = function(method, model, success, error){
    success();
  };
//创建目标模型
  var Item = Backbone.Model.extend({
    defaults: {
      text:"hello backbone"
    }
  });
//创建目标集合
  var List = Backbone.Collection.extend({
    model: Item
  });
//创建目标视图
  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created
    events: {
      'click span.delete': 'remove'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'remove');

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },
    render: function(){
      $(this.el).html('<span style="color:black;">'+this.model.get('text')+'</span> &nbsp; &nbsp; <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
      return this; // for chainable calls, like .render().el
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    unrender: function(){
      $(this.el).remove();
    },
    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.model.destroy();
    }
  });
//创建集合视图
  var ListView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click button#add': 'addItem'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem');

      this.collection = new List();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        text: item.get('text') + this.counter // modify item defaults
      });
      this.collection.add(item);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $('ul', this.el).append(itemView.render().el);
    }
  });

  var listView = new ListView();
})