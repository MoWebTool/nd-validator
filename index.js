/**
 * @module: nd-validator
 * @author: crossjs <liwenfu@crossjs.com> - 2015-01-08 11:57:59
 */

'use strict';

var $ = require('jquery'),
  Core = require('./src/core');

var Validator = Core.extend({

  events: {
    'mouseenter .{{attrs.inputClass}}': 'mouseenter',
    'mouseleave .{{attrs.inputClass}}': 'mouseleave',
    'mouseenter .{{attrs.textareaClass}}': 'mouseenter',
    'mouseleave .{{attrs.textareaClass}}': 'mouseleave',
    'focus .{{attrs.itemClass}} input,textarea,select': 'focus',
    'blur .{{attrs.itemClass}} input,textarea,select': 'blur'
  },

  attrs: {
    explainClass: 'ui-form-explain',
    itemClass: 'ui-form-item',
    itemHoverClass: 'ui-form-item-hover',
    itemFocusClass: 'ui-form-item-focus',
    itemErrorClass: 'ui-form-item-error',
    inputClass: 'ui-input',
    textareaClass: 'ui-textarea',

    showMessage: function(message, element) {
      this.getExplain(element).html(message);
      this.getItem(element).addClass(this.get('itemErrorClass'));
    },

    hideMessage: function(message, element) {
      this.getExplain(element).html(element.data('explain') || ' ');
      this.getItem(element).removeClass(this.get('itemErrorClass'));
    }
  },

  setup: function() {
    Validator.superclass.setup.call(this);

    var that = this;

    this.on('autoFocus', function(ele) {
      that.set('autoFocusEle', ele);
    });
  },

  addItem: function(cfg) {
    Validator.superclass.addItem.apply(this, arguments);

    var item = this.query(cfg.element);

    if (item) {
      this._saveExplainMessage(item);
    }

    return this;
  },

  _saveExplainMessage: function(item) {
    var ele = item.element;

    var explain = ele.data('explain');
    // If explaining message is not specified, retrieve it from data-explain attribute of the target
    // or from DOM element with class name of the value of explainClass attr.
    // Explaining message cannot always retrieve from DOM element with class name of the value of explainClass
    // attr because the initial state of form may contain error messages from server.
    // ---
    // Also, If explaining message is under ui-form-item-error className
    // it could be considered to be a error message from server
    // that should not be put into data-explain attribute
    if (typeof explain === 'undefined' && !this.getItem(ele).hasClass(this.get('itemErrorClass'))) {
      ele.data('explain', this.getExplain(ele).html());
    }
  },

  getExplain: function(ele) {
    var item = this.getItem(ele);
    var explain = item.find('.' + this.get('explainClass'));

    if (explain.length === 0) {
      explain = $('<div class="' + this.get('explainClass') + '"></div>').appendTo(item);
    }

    return explain;
  },

  getItem: function(ele) {
    return $(ele).parents('.' + this.get('itemClass'));
  },

  mouseenter: function(e) {
    this.getItem(e.target).addClass(this.get('itemHoverClass'));
  },

  mouseleave: function(e) {
    this.getItem(e.target).removeClass(this.get('itemHoverClass'));
  },

  focus: function(e) {
    var target = e.target,
      autoFocusEle = this.get('autoFocusEle'),
      that = this;

    if (autoFocusEle && autoFocusEle.has(target)) {
      $(target).keyup(function() {
        that.set('autoFocusEle', null);
        that.focus({target: target});
      });

      return;
    }

    var item = this.getItem(target);

    item.removeClass(this.get('itemErrorClass'))
        .addClass(this.get('itemFocusClass'));

    this.getExplain(target).html($(target).data('explain') || '');
  },

  blur: function(e) {
    this.getItem(e.target).removeClass(this.get('itemFocusClass'));
  }
});

Validator.pluginEntry = {
  name: 'Validator',
  starter: function() {
    var plugin = this,
      host = plugin.host;

    plugin.execute = function() {
      plugin.exports = new Validator({
        element: host.element
      });

      plugin.trigger('export', plugin.exports);
    };

    host.after('render', plugin.execute);

    // 通知就绪
    this.ready();
  }
};

module.exports = Validator;
