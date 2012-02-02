/* Author: Marcos Ojeda <marcos@khanacademy.org>

TODO show-guess support from khan-exercises needs to be added in
TODO problems that use the same data but over multiple questions
TODO use _.has when checking for properties to retain in scoped eval since console is not being saved
*/

(function(){

  var trapper = {

    vars: [],

    initialize: function(){
      if(this.init){ this.init(); }
    },

    reveal: function( section ){
      $(".tangly[data-section=" + section + "]:hidden").show()
    }

  }

  // gather all the vars on the page
  $("span[data-name]", $(".tangly")).each( function(i, e){
    $el = $(e);
    var name = $el.data("name");
    trapper.vars.push(name);
  })

  // with help from 
  // http://stackoverflow.com/questions/543533/restricting-eval-to-a-narrow-scope
  // and also
  // http://www.yuiblog.com/blog/2006/04/11/with-statement-considered-harmful/
  // evaluates some text in the context of an empty scope var
  var scopedEval = function( src, propWhitelist, callback){
    var scope = {};
    for (prop in this){
		if (prop !== "console" && prop !== "KhanUtil") {
			scope[prop] = undefined;
		}
	}

    // capture whitelisted properties in scope if defined
    if(propWhitelist !== undefined){
      for (var i=0; i<propWhitelist.length; i+=1){ scope[propWhitelist[i]] = true; }
    }

    // eval in scope
    (new Function( "with(this) { "+ src +"};" )).call(scope);

    if(propWhitelist !== undefined){
      // cleanse any global vars made in the scope not in the whitelist
      var callbackScope = {};
      for(var i=0; i<propWhitelist.length; i+=1){
        callbackScope[propWhitelist[i]] = scope[propWhitelist[i]];
      }
    }
    else{
      var callbackScope = $.extend({}, scope)
    }
    // either return the restricted scope the code ran in or it fed through a callback
    return (callback !== undefined) ? callback(callbackScope) : callbackScope;
  }

  // evaluate all the trapper scripts in a protected context
  var defaultSrc = $("script[type='trapper/script']");
  if (defaultSrc){
    try {
      var scopey = scopedEval(defaultSrc.text(), ["defaults", "update", "init"]);
      if(scopey.defaults){ 
        $.extend(trapper, scopey)
      }
    }
    catch(e) { 
      console.error("omg wtf problem with trapper script:", e);
    }
  }

  var TrapperKeeper = Backbone.Model.extend(trapper);

  var binder = new TrapperKeeper;

  var VarView = Backbone.View.extend({ 

    initialize: function(){
      if(this.model.update){
        this.model.bind("change", this.render, this)
      }
    },

    render: function(){
      var name = this.$el.data("name");
      var value = this.model.get(name);
      this.$el.text(value)
      return this;
    }
  });


  var EditableVar = VarView.extend({
    events: {
      "keyup": "saveState",
      "click": "toggleEdit",
    },

    toggleEdit: function(){
      var name = this.$el.data("name");
      var val = this.model.get(name);
      this.$el.html($("<input />").attr({'value':val}));

      var that = this;
      this.$("input").focus().on("blur", function(){ that.saveState()})
    },

    saveState: function(evt){
      var name = this.$el.data("name");
      var val = this.$("input").val();

      // is it a number?
      if(isNaN(Number(val))){
        // this may be handled otherwise
        this.$el.addClass("invalid")
      }else{
        this.$el.removeClass("invalid")
        val = Number(val);
        var tosave = {};
        tosave[name] = val;

        this.model.set(tosave);
        if(this.model.update){ this.model.update(); }
        this.render()
      }
    },

    render: function(){
      var name = this.$el.data("name");
      var val = this.model.get(name);
      if (this.$("input:focus").length === 0){
        this.$el.text(val);
      }
      return this;
    }
  });

  var SlidableVar = VarView.extend({

    initialize: function(){
      var name = this.$el.data("name");
      var val = this.model.get(name);
      VarView.prototype.initialize.call(this)
      this.$el.slidable({'value': val, 'model': this.model});
    },

    render: function(){
      return VarView.prototype.render.call(this)
    }
  })

  var DraggableVar = VarView.extend({
    initialize: function(){
    },
    render: function(){
      var name = this.$el.data("name");
      this.$el.text(name);
      this.$el.draggable();
    }
  })

  var DroppableVar = VarView.extend({
    initialize: function(){
    },
    render: function(){
      var name = this.$el.data("name");
      this.$el.text(name);
      var that = this;
      var dropAction = function(e,u){
        // dropping a var onto the droppable causes the target to 
        // inherit the value of the droppable 
        // TODO remove redundant elements (i.e. dropping a second elements should clear out the first)
        var droppedVar = $(u.draggable).data("name");
        var droppedVal = that.model.get(droppedVar);
        var targetName = $(this).data("name");
        that.model.set(targetName, droppedVal);
        if(that.model.update) { that.model.update(); }
      };
      this.$el.droppable({drop: dropAction});
    }
  })


  $.widget( "ka.slidable", $.ui.mouse, {
    _create:function(){
      this._mouseInit();
    },
    destroy: function(){
      this._mouseDestroy();
      $.Widget.prototype.destroy.call( this );
    },

    // defaults at zero, with a min/max of 100
    // make sure these are settable via data-attrs?
    options: { value: 0, min:-100, max:100, width:10, model:{} },
    _setOption: function( k, v ){
      $.Widget.prototype._setOption.apply( this, arguments );
    },
    setValue: function( value ){
      if (value < this.options.min) {
        this.options.value = this.options.min;
      }else if (value > this.options.max) {
        this.options.value = this.options.max;
      }else{
        this.options.value = value;
        var name = this.element.data("name")
        this.options.model.set(name, value)
        if (this.options.model.update) { this.options.model.update() }
      }
    },

    _mouseStart: function(evt){
      this.clickStart = evt.pageX;
      this.value = this.options.value;
      $("html").addClass("sliding")
    },
    _mouseStop: function(){
      $("html").removeClass("sliding")
    },
    _mouseDrag: function(evt){
      var apparentValue = Math.floor(this.value + (evt.pageX - this.clickStart) / this.options.width);
      this.setValue( apparentValue );
    }

  })


  // map across all vars and assign them views
  _( $( "span[data-name]", $( ".tangly" ) ) ).each( function(elt, idx){
    var bundle = {el: $(elt), model: binder};
    var type = $(elt).data("type");
    if (type === "editable"){
      var inst = new EditableVar( bundle );
    }
    else if (type == "slidable"){
      var inst = new SlidableVar( bundle );
    }
    else if (type == "draggable"){
      var inst = new DraggableVar( bundle );
    }
    else if (type == "target"){
      var inst = new DroppableVar( bundle );
    }
    
    else{
      var inst = new VarView( bundle );
    }
    inst.render()
  });

})();
