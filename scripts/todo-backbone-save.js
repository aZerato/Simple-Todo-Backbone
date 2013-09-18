(function($) {
	/*
	 * Model
	 */
	var Todo = Backbone.Model.extend({
		defaults: {
			id: 0,
			content: '',
			state: false
		}
	});

	/*
	 * Collection
	 */
	var Todos = Backbone.Collection.extend({
		model: Todo
	});

	/*
	 * Views
	 */
	var TodosView = Backbone.View.extend({
		el: '[data-collection=todos]',

		events: {
			'click [data-bind=addTodo]' : 'addTodo',
			'click [data-bind=loadTodos]' : 'loadTodos',
			'click [data-bind=saveTodos]' : 'saveTodos',
			'click [data-bind=clearTodos]' : 'clearTodos'
		},

		initialize: function() {
			_.bindAll(this, 'addTodo', 'loadTodos', 'saveTodos', 'clearTodos', 'appendTodo');

			this.todos = new Todos();
			this.todos.bind('add', this.appendTodo);

			this.render();
		},

		render: function() {
			var self = this;
			_(this.todos.models).each(function(todo){ 
				self.appendTodo(todo);
			}, this);
		},

		addTodo: function() {
			var todo = new todo();

			this.todos.add(todo);
		},

		appendTodo: function(todo) {
			var todoView = new TodoView({
				model: todo
			});
			$(this.el).append(todoView.render());
		}/*,

		loadTodos: function() {
			alert('sqd');
		},

		saveTodos: function() {
			alert('sqd');
		},

		clearTodos: function() {
			alert('sqd');
		}*/
	});

	var TodoView = Backbone.View.extend({
		el: '[data-model=todo]',

		events: {
			'click [data-bind=removeTodo]' : 'removeTodo'
		},

		initialize: function() {
			// Share 'this' on the differents function
			_.bindAll(this, 'render', 'unrender', 'removeTodo');

			this.model.bind('change', this.render);
			this.model.bind('remove', this.unrender);
		},

		render: function() {
			$(this.el).html('
				<td><span></span>' + this.model.get('id') + '</td>
                <td><input type="text"/>' + this.model.get('content') + '</td>
                <td><input type="checkbox" cheched="' + this.model.get('state') + '"/></td>
                <td><a class="btn btn-danger" href="#" data-bind="removeTodo">Remove</a></td>
            ');

			return this;
		},

		unrender: function() {
			$(this.el).remove();
		},

		removeTodo: function() {
			this.model.destroy();
		}
	});

	var todosView = new TodosView();

})(jQuery);