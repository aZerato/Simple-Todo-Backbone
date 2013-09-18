/*
 * Model
 */
var Todo = Backbone.Model.extend({
	/* defaults attributes values */
	defaults: {
		id: 1,
		content: 'content',
		state: false
	}
});

/*
 * Collection
 */
var Todos = Backbone.Collection.extend({
	/* Type of collection */
	model: Todo,
	/* important to specify even if it's factice for manipulate the collection from differents views */
	url: 'todos.json'
});

/*
 * Views
 */
var TodosView = Backbone.View.extend({
	/* el : is a selector */
	el: '.todosView',

	/* elCollection : is a personnalisated selector, and the tbody of table of todos */
	elCollection: '[data-collection=todos]',

	/* Events listener : type of control, on specified dom element, & the function that need to execute */
	events: {
		'click [data-bind=addTodo]' : 'addTodo',
		'click [data-bind=saveTodos]' : 'saveTodos',
		'click [data-bind=loadTodos]' : 'loadTodos',
		'click [data-bind=clearTodos]' : 'clearTodos'
	},

	initialize: function() {
		/* Thanks to underscore, i can bind 'this' in the differents specified functions */
		_.bindAll(this, 'render', 'addTodo', 'loadTodos', 'saveTodos');


		this.todos = new Todos();

		/* When todos Collection detect "add" event, execute the function render */
		this.todos.bind('add', this.render);
	},

	render: function() {
		/* Clear dom */
		$(this.elCollection).empty();

		/* underscore foreach : i execute render of TodoView for generate html, and append in element elCollection */
		_.each(this.todos.models, function(todo) {
			$(this.elCollection).append(new TodoView({model: todo}).render().el);
		}, this);

		return this;
	},

	addTodo: function() {
		var todo = new Todo();
		todo.set('id', this.todos.length == 0 ? 1 : this.todos.last().get('id') + 1);
		this.todos.add(todo);
	},

	loadTodos: function() {
		var ltodos = localStorage.getItem("todos");
		if(ltodos == null) {
			alert('Nothing in the localStorage !');
			return;
		}
		this.todos.add(JSON.parse(ltodos));
		this.render();
	},

	saveTodos: function() {
		localStorage.setItem("todos", JSON.stringify(this.todos.toJSON()));
	},

	clearTodos: function() {
		localStorage.clear();
	}
});

var TodoView = Backbone.View.extend({
	/* tagName : is type of dom element that encapsulate my itemview */
	tagName: 'tr',

	events: {
		'click [data-bind=removeTodo]' : 'removeTodo',
		'keypress [data-bind=content]' : 'updateTodo',
		'click [data-bind=state]' : 'updateTodo'
	},

	initialize: function() {
		_.bindAll(this, 'render', 'unrender', 'removeTodo', 'updateTodo');

		this.model.on('destroy', this.unrender);
	},

	render: function() {
		var curState = this.model.get('state') == false ? '' : 'checked="checked"';
		this.$el.html('<td><span>' + this.model.get('id') + '</span></td><td><input type="text" data-bind="content" value="' + this.model.get('content') + '"/></td><td><input type="checkbox" data-bind="state" ' + curState + ' /></td><td><a class="btn btn-danger" data-bind="removeTodo">Remove</a></td>');
		return this;
	},

	unrender: function() {
		this.$el.remove();
		return this;
	},

	removeTodo: function() {
		var self = this;
		self.model.destroy({
			success: function(){
				self.unrender();
			},
			error: function(){
				console.log('Error during attempt to delete todo !');
			}
		});
	},

	updateTodo: function() {
		/* Set value of the current object <-> itemView */
		this.model.set('content', this.$el.find('[data-bind=content]').val());
		this.model.set('state', this.$el.find('[data-bind=state]').is(':checked') ? true : false);
	}
});

