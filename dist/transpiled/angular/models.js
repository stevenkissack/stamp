'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  // Base for all components

  var Component = function () {
    function Component(name, group) {
      _classCallCheck(this, Component);

      this.name = name;
      this.group = group;
    }

    _createClass(Component, null, [{
      key: 'validate',
      value: function validate(component) {
        // True
        return true;
      }
      /*insert () {
        
      }
      */

    }]);

    return Component;
  }();

  // Base for all layouts of blocks


  var Layout = function () {
    function Layout(name) {
      _classCallCheck(this, Layout);

      this.name = name;
    }

    _createClass(Layout, null, [{
      key: 'validate',
      value: function validate(layout) {
        // True
        return true;
      }
      /*insert () {
        
      }
      */

    }]);

    return Layout;
  }();

  // Holds multiple blocks


  var Stack = function () {
    function Stack(StampInstance) {
      _classCallCheck(this, Stack);

      this.blocks = [];
    }

    _createClass(Stack, [{
      key: 'get',
      value: function get() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'add',
      value: function add() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'move',
      value: function move() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'remove',
      value: function remove() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'length',
      get: function get() {
        return this.blocks.length;
      }
    }]);

    return Stack;
  }();

  var Block = function () {
    function Block(component, attrs) {
      _classCallCheck(this, Block);

      this.components = [];
      this.attrs = attrs;
      //this.attrs = Object.assign({ Think we want layout undefined
      // layout: 'oneColumn' // Default layout
      //}, attrs)
    }

    _createClass(Block, [{
      key: 'add',
      value: function add(component) {
        this.components.push(component);
      }
    }, {
      key: 'remove',
      value: function remove(componentIndex) {
        var removedItems = this.components.splice(componentIndex, 1);
        removedItems = null; // Not sure if we need to do anything with them
      }
    }]);

    return Block;
  }();

  /**
   * Note: 
   * 		- Stacks are built up of blocks which contain components
   * 		- Moving components between blocks is not supported yet
   */

  var Stamp = function () {
    function Stamp(attrs) {
      _classCallCheck(this, Stamp);

      this.attributes = Object.assign({
        locked: false, // Stop stack changes
        readOnly: false // Stop content edits
      }, attrs);
      this.stack = new Stack(this);
    }

    _createClass(Stamp, [{
      key: 'exportJSON',
      value: function exportJSON() {
        throw new Error('NotImplementedException');
        return ExportJSON(this);
      }
    }, {
      key: 'importJSON',
      value: function importJSON(json) {
        throw new Error('NotImplementedException');
        var instance = ImportJSON(json);
        this.attributes = instance.attributes;
        this.stack = instance.stack;
      }

      /*get editable() {
        // TODO: Should implement Block.editable & Component.editable
        return this.attributes.locked === false
      }
      
      set editable(val) {
        // Force Boolean value
        this.attributes.locked = !!val
      }*/

    }, {
      key: 'addBlock',
      value: function addBlock() {
        var index = arguments.length <= 0 || arguments[0] === undefined ? this.stack.length : arguments[0];
        var attrs = arguments[1];

        // If no specified position, defaults to end
        this.stack.add(index, new StackItem(attrs));
      }
    }, {
      key: 'removeBlock',
      value: function removeBlock(index) {
        if (index === undefined) return;
        this.stack.remove(index);
      }
    }, {
      key: 'moveBlock',
      value: function moveBlock(index, newIndex) {
        if (index === undefined || newIndex === undefined) return;
        this.stack.move(index, newIndex);
      }
    }, {
      key: 'addComponent',
      value: function addComponent(blockIndex, component) {
        if (!Component.validate(component)) return 'Not A Valid Stamp Component';

        var stackItem = this.stack.get(blockIndex);
        if (!stackItem) return 'Not A Valid Stack Index';

        stackItem.add(component);
      }
    }, {
      key: 'removeComponent',
      value: function removeComponent(blockIndex, componentIndex) {
        var stackItem = this.stack.get(blockIndex);
        if (!stackItem) return 'Not A Valid Stack Index';
        stackItem.remove(componentIndex);
      }

      /*moveComponent(blockIndex, index, newBlockIndex, newIndex) {
        
      }*/

    }]);

    return Stamp;
  }();

  var stampModels = angular.module('stamp.models', []);
  stampModels.value('Component', Component);
  stampModels.value('Layout', Layout);
  stampModels.value('Stack', Stack);
  stampModels.value('Block', Block);
})();