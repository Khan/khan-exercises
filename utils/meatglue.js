/* Author: Marcos Ojeda <marcos@khanacademy.org>

TODO show-guess support from khan-exercises needs to be added in
TODO problems that use the same data but over multiple questions

Requires:
	jQuery 1.7+
	jQuery UI 1.8.16+
	backbone .9+
	underscore 1.3.1+

*/

(function(){

	var defaultBinder = {

		initialize: function(){
			if( _.isFunction(this.init) ){ this.init(); }
		},

		reveal: function( section ){
			var hiddenSection = $(this.problem).find("[data-section=" + section + "]:hidden")
			hiddenSection.show("slow");
		},

		createVars: function( varNames, varType, where){
			$(where).empty()
			for (var i=0, len = varNames.length; i<len; i+=1){
				var elt = jQuery("<span>")
					.attr({"data-type": varType, "data-name":varNames[i]})
					.appendTo(where)
				bindMeat(elt, null, this);
			}
		},

		inheritExerciseVars: function(){
			// absorb the exercise's variables
			var ev = KhanUtil.tmpl.getVARS();
			for (k in ev){ this.set(k, ev[k]); }
		}

	}

	// with help from
	// http://stackoverflow.com/questions/543533/restricting-eval-to-a-narrow-scope
	// and also
	// http://www.yuiblog.com/blog/2006/04/11/with-statement-considered-harmful/
	// evaluates some text in the context of an empty scope var
	// TODO document propWhitelist behavior, usage...
	var scopedEval = function( src, propWhitelist, callback){
		var scope = {};

		// if you normally eval some code in a scope as is done below variables created
		// are not kept at the end of execution. This prepopulates them so that they can
		// live outside of their eval'd scope.
		if( _.isArray( propWhitelist ) ){
			for (var i=0; i<propWhitelist.length; i+=1){ scope[propWhitelist[i]] = true; }
		}

		// eval in scope
		(new Function( "with(this) { "+ src +"};" )).call(scope);

		var callbackScope = $.extend({}, scope)
		// either return the restricted scope the code ran in or it fed through a callback
		return (callback !== undefined) ? callback(callbackScope) : callbackScope;
	}

	// set up the default environment on startup and return the created model
	var initialize = function(problem){
		// evaluate all the meatglue scripts in a protected context
		var defaultSrc = problem.find("script[type='text/meatglue']");

		// protect all data-onchange function names attached to vars
		var whitelisted = _.map( problem.find("[data-onchange]"), function( elt ){
			return $(elt).data("onchange");
		})
		var whitelist = _.union( ["defaults", "update", "init"], whitelisted );

		if (defaultSrc){
			// TODO (marcos) this will be better if we don't eval and instead make each script a stored callback
			// i.e. <script type='text/meatglue'>meatglue.load( {...} )</script> which is cloned and then reinserted
			// as type=text/javascript causing it to be finally evaluated after the problem is setup
			try { var scope = scopedEval(defaultSrc.html(), whitelist); }
			catch(e){ if(window.console){ console.log("There was a problem with the meatglue script:", e); } }
			var scope = scopedEval(defaultSrc.html(), whitelist);
			$.extend(defaultBinder, scope)
		}

		// be able to access the problem area
		$.extend( defaultBinder, {problem: problem} );

		var MeatBinder = Backbone.Model.extend(defaultBinder);
		return new MeatBinder;

	}

	var VarView = Backbone.View.extend({

		// VarViews are rendered once and when the model is altered they are rendered again
		initialize: function(){
			if( _.isFunction(this.model.update) ){
				this.model.bind("change", this.render, this)
			}
		},

		render: function(){
			var name = this.$el.data("name");
			var value = this.model.get(name);
			this.$el.text(value || "")
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
				if( _.isFunction(this.model.update)){ this.model.update(); }
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
			// TODO don't call update here in render, but here?
			// return VarView.prototype.initialize.call(this)
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
				that.model.set(targetName, droppedVar);
				if(that.model.update) { that.model.update(); }
			};

			var outAction = function(e,u){
				var targetName = $(this).data("name");
				var droppableName = $(u.draggable).data("name");
				// ignore other droppables leaving this target
				if( droppableName === that.model.get(targetName) ){
					that.model.set(targetName, undefined);
					if(that.model.update) { that.model.update(); }
				}
			}

			this.$el.droppable({drop: dropAction, out: outAction});
		}
	})

	var SelectableVar = VarView.extend({
		// SelectableVars allow you to create a series of checkbox controls and then let you pick n
		// of those values. Use case:
		// pick the values you'd need to solve this equation
		// pick out all variables which are prime
		// it will save, on each click, the value
		events: {
			"change": "render",
		},
		initialize: function(){
			var validator = _.bind( this.doublecheck, this );
			var name = this.$el.data("name")
			var opts = this.$el.data("options").split(",")
			var form = $("<form>")
			var that = this;
			_( opts ).each(function( elt ){
				var sp = $("<span>")
				var pfx = _.uniqueId("elt");
				var label = $( "<label>", {'for': pfx} ).text( elt );
				var button = $("<input />", {type:'checkbox', id:pfx, name:elt, value:elt});
				button.on("click", validator)
				sp.append(label).append(button);
				form.append(sp);
			})

			// attach a change handler to the selectable var via the data-onchange
			var changeHandler = this.$el.data("onchange")
			if( changeHandler && _.isFunction( this.model[changeHandler] ) ){
				// make sure the handler runs in the model context
				var onchange = _.bind( this.model[changeHandler], this.model);
				this.$el.on( "postchange", onchange);
			}

			this.$el.html( form )
		},

		doublecheck: function dc( evt ){
			var selected = this.$el.find("form input:checkbox:checked");
			if( this.$el.data("max") ){
				return ( selected.length <= this.$el.data("max") )
			}
		},

		render: function(){
			var name = this.$el.data("name");
			var opts = this.$el.data("options").split(",");
			var namey = function( elt ){ return $(elt).val(); };
			var checked = _.map(this.$el.find("form input:checkbox:checked"), namey);
			this.model.set(name, checked)
			this.$el.trigger( "postchange" ) // fire the
			if( _.isFunction(this.model.update) ) { this.model.update(); }
			return this;
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

	var bindMeat = function (elt, idx, binder){
		var bundle = {el: $(elt), model: binder};
		var type = ( $(elt).data("type") || "" ).toLowerCase();

		switch ( type ){
			case "editable":
				var inst = new EditableVar( bundle );
				break;
			case "slidable":
				var inst = new SlidableVar( bundle );
				break;
			case "draggable":
				var inst = new DraggableVar( bundle );
				break;
			case "droppable":
				var inst = new DroppableVar( bundle );
				break;
			case "selectable":
				var inst = new SelectableVar( bundle );
				break;
			default:
				var inst = new VarView( bundle );
				break;
		}
		inst.render();
	}


	jQuery.fn[ "meatglueLoad" ] = function(prob, info){
		// eval the meatglue script in the prob elt and extend the default obj with it
		var binder = initialize(prob);
		window.TK = binder; // TODO (marcos) this external reference is mostly for testing

		// map across all vars and assign them views
		var bindIt = function(e, i, m) { bindMeat(e, i, binder); }
		_( $( "span[data-name]", $( ".meatglue" ) ) ).each( bindIt );
	}

})();