<template>
  <div class="todo-wrapper">
    <h1 class="todo-title">todos</h1>
    <div class="todo">
      <div class="todo-line">
        <input
          type="checkbox"
          class="iconfont icon-down-arrow todo-line-left"
          :class="{'selectAll': selectAll}"
          v-model="selectAll"
        />
        <input
          type="text"
          class="todo-line-center"
          placeholder="What needs to be done?"
          v-model.trim="newTodo"
          @keyup.enter="addTodo"
        />
      </div>
      <ul class="todo-line-wrapper" v-if="todos.length">
        <li
          class="todo-line-li"
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :class="{'editing': editingTodo}"
        >
          <div class="todo-line">
            <i
              class="iconfont icon-hook todo-line-left"
              @click="finishItem(todo)"
              :class="{'finish': todo.isFinish}"
            ></i>
            <label
              class="todo-line-center"
              :class="{'finish': todo.isFinish}"
              @dblclick="editItem(todo)"
            >{{todo.content}}</label>
            <i class="iconfont icon-delete todo-line-right" @click="deleteItem(index)"></i>
          </div>
          <input
            v-focus="editingTodo === todo"
            v-if="editingTodo === todo"
            type="text"
            class="todo-line-input"
            v-model.trim="todo.content"
            @blur="confirmEdit"
            @keyup.enter="confirmEdit"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
      <div class="todo-footer" v-if="todos.length">
        <span class="todo-footer-left">{{leftItems}} {{leftItems === 1 ? 'item':'items'}} left</span>
        <span class="todo-footer-center button">
          <button
            class="button-all"
            :class="{'active': checkedButton === 'all'}"
            @click="changeCheck('all')"
          >All</button>
          <button
            class="button-active"
            :class="{'active': checkedButton === 'active'}"
            @click="changeCheck('active')"
          >Active</button>
          <button
            class="button-completed"
            :class="{'active': checkedButton === 'completed'}"
            @click="changeCheck('completed')"
          >Completed</button>
        </span>
        <span class="todo-footer-right" @click="$refs.popup.show()">Clear completed</span>
      </div>
    </div>
    <Popup ref="popup" @confirm="clearAllCompleted" @cancel="$refs.popup.hide()"></Popup>
  </div>
</template>
<script>
import Popup from "components/popup";
import storage from "assets/js/storage.js";
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter(todo => !todo.isFinish);
  },
  completed(todos) {
    return todos.filter(todo => todo.isFinish);
  }
};
export default {
  name: "Todo",
  components: { Popup },
  data() {
    return {
      newTodo: "",
      todos: [],
      checkedButton: "all",
      filteredTodos: null,
      editingTodo: null,
      editingTodoCacheContent: null
    };
  },
  created() {
    this.getTodos();
  },
  methods: {
    getTodos() {
      this.todos = this.filteredTodos = storage.get("todos", []);
    },
    addTodo() {
      if (!this.newTodo) return;
      this.todos.unshift({
        content: this.newTodo,
        isFinish: false
      });
      this.newTodo = "";
      storage.set("todos", this.todos);
      this.changeCheck(this.checkedButton);
    },
    deleteItem(index) {
      this.todos = this.todos.filter((todo, i) => i !== index);
      storage.set("todos", this.todos);
      this.changeCheck(this.checkedButton);
    },
    finishItem(todo) {
      todo.isFinish = !todo.isFinish;
      storage.set("todos", this.todos);
      this.changeCheck(this.checkedButton);
    },
    clearAllCompleted() {
      this.todos = filters.active(this.todos);
      storage.set("todos", this.todos);
      this.changeCheck(this.checkedButton);
      this.$refs.popup.hide();
    },
    changeCheck(buttonText) {
      this.checkedButton = buttonText;
      this.filteredTodos = filters[buttonText](this.todos);
    },
    editItem(todo) {
      this.editingTodo = todo;
      this.editingTodoCacheContent = todo.content;
    },
    cancelEdit(todo) {
      todo.content = this.editingTodoCacheContent;
      this.editingTodo = null;
    },
    confirmEdit() {
      if (this.editingTodo && !this.editingTodo.content) {
        this.todos = this.todos.filter(todo => this.editingTodo !== todo);
        this.changeCheck(this.checkedButton);
      }
      storage.set("todos", this.todos);
      this.editingTodo = null;
    }
  },
  computed: {
    leftItems() {
      return filters.active(this.todos).length;
    },
    selectAll: {
      get() {
        return this.leftItems === 0;
      },
      set(value) {
        this.todos.forEach(todo => (todo.isFinish = value));
        storage.set("todos", this.todos);
      }
    }
  },
  directives: {
    focus: {
      inserted(el, { value }) {
        value && el.focus();
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../assets/css/_mixins.scss";
.todo {
  &-wrapper {
    width: 80vw;
    margin: 30px auto;
    text-align: center;
  }
  &-title {
    font-size: 80px;
    color: #ead7d7;
    font-style: italic;
  }
  & {
    @include flex-center(column);
    border: 1px solid #ededed;
    box-shadow: 0 6px 15px 2px #ddd;
    border-radius: 3px;
    > .todo-line {
      .iconfont.icon-down-arrow {
        border: none;
        transition: all 0.2s;
        cursor: pointer;
        &.selectAll {
          color: #737373;
        }
      }
    }
    &-line-wrapper {
      width: 100%;
    }
    &-line-li {
      width: 100%;
      position: relative;
    }
    &-line {
      text-align: left;
      cursor: pointer;
      padding: 20px;
      width: 100%;
      border-bottom: 1px solid #ededed;
      @include flex-between();
      color: #4d4d4d;
      transition: all 0.2s;
      &-left {
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 50%;
        &.icon-hook:before {
          opacity: 0;
          transition: all 0.2s;
        }
        &.finish {
          border-color: #5dc2af;
        }
        &.finish.icon-hook:before {
          opacity: 1;
          color: #5dc2af;
        }
      }
      &-center {
        flex: 1;
        margin-left: 20px;
        transition: all 0.2s;
        font-size: 25px;
        &.finish {
          text-decoration: line-through;
          color: #d9d9d9;
        }
      }
      .icon-delete:before {
        color: #cc9a9a;
        transition: opacity 0.2s;
        opacity: 0;
      }
      &:hover .icon-delete:before {
        opacity: 1;
      }
      &-input {
        position: absolute;
        top: 0;
        left: 50px;
        width: calc(100% - 50px);
        border: 1px solid #999999;
        box-shadow: inset 0 0 6px 1px #ddd;
        height: 100%;
        padding: 20px;
        color: #4d4d4d;
      }
    }
  }
  &-footer {
    cursor: pointer;
    padding: 20px;
    @include flex-between();
    width: 100%;
    color: #777777;
    .button {
      button {
        cursor: pointer;
        padding: 1px 9px;
        border: 1px solid transparent;
        border-radius: 3px;
        transition: all 0.2s;
        &.active {
          border-color: #efd5d5;
        }
      }
    }
  }
  input {
    font-size: 25px;
  }
}
</style>