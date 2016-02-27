/**
 * @module Validator
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var $ = require('nd-jquery');

var Core = require('./src/core');
var Rule = require('./src/rule');

var Validator = Core.extend({

  events: {
    'focus .{{attrs.itemClass}} input,textarea,select': 'focus',
    'blur .{{attrs.itemClass}} input,textarea,select': 'blur',
    'mouseup .{{attrs.explainClass}}': function(e) {
      this.getItem(e.currentTarget).find('input,textarea,select').focus();
    }
  },

  attrs: {
    explainClass: 'ui-form-explain',
    itemClass: 'ui-form-item',
    itemFocusClass: 'ui-form-item-focus',
    itemErrorClass: 'ui-form-item-error',
    inputClass: 'ui-form-input',
    textareaClass: 'ui-form-textarea',

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

    Rule.init();

    this.on('autoFocus', function(ele) {
      this.set('autoFocusEle', ele);
    }.bind(this));
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

  // mouseenter: function(e) {
  //   this.getItem(e.target).addClass(this.get('itemHoverClass'));
  // },

  // mouseleave: function(e) {
  //   this.getItem(e.target).removeClass(this.get('itemHoverClass'));
  // },

  focus: function(e) {
    var target = e.target,
      autoFocusEle = this.get('autoFocusEle');

    if (autoFocusEle && autoFocusEle.has(target)) {
<<<<<<< HEAD
      $(target).on('input',function() {
        that.set('autoFocusEle', null);
        that.focus({target: target});
      });

      return;
=======
      return this.set('autoFocusEle', null);
>>>>>>> 1.x
    }

    var item = this.getItem(target);

    item.removeClass(this.get('itemErrorClass'))
      .addClass(this.get('itemFocusClass'));

    this.getExplain(target).html(target.getAttribute('data-explain') || '');
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
      plugin.exports = new Validator($.extend(true, {
        element: host.element
      }, plugin.getOptions('config')));

      // for form
      typeof host.addField === 'function' &&
        host.after('addField', function(ret, options) {
          Validator.addItemFromHTML(plugin.exports, '[name="' + options.name + '"]');
        });

      // for form
      typeof host.removeField === 'function' &&
        host.before('removeField', function(name) {
          plugin.exports.removeItem(host.$('[name="' + name + '"]'));
        });

      plugin.trigger('export', plugin.exports);
    };

    typeof host.use === 'function' &&
      plugin.on('export', function(instance) {
        host.use(function(next) {
          instance.execute(function(err) {
            if (!err) {
              next();
            }
          });
        }, 'Validator');
      });

    host.after('render', plugin.execute);

    host.before('destroy', function() {
      plugin.exports && plugin.exports.destroy();
    });

    // 通知就绪
    this.ready();
  }
};

module.exports = Validator;
