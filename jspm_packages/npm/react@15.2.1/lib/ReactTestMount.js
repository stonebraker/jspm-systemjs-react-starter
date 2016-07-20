/* */ 
(function(process) {
  'use strict';
  var ReactElement = require('./ReactElement');
  var ReactInstrumentation = require('./ReactInstrumentation');
  var ReactReconciler = require('./ReactReconciler');
  var ReactUpdates = require('./ReactUpdates');
  var emptyObject = require('fbjs/lib/emptyObject');
  var getHostComponentFromComposite = require('./getHostComponentFromComposite');
  var instantiateReactComponent = require('./instantiateReactComponent');
  var TopLevelWrapper = function() {};
  TopLevelWrapper.prototype.isReactComponent = {};
  if (process.env.NODE_ENV !== 'production') {
    TopLevelWrapper.displayName = 'TopLevelWrapper';
  }
  TopLevelWrapper.prototype.render = function() {
    return this.props;
  };
  function mountComponentIntoNode(componentInstance, transaction) {
    var image = ReactReconciler.mountComponent(componentInstance, transaction, null, null, emptyObject);
    componentInstance._renderedComponent._topLevelWrapper = componentInstance;
    return image;
  }
  function batchedMountComponentIntoNode(componentInstance) {
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    var image = transaction.perform(mountComponentIntoNode, null, componentInstance, transaction);
    ReactUpdates.ReactReconcileTransaction.release(transaction);
    return image;
  }
  var ReactTestInstance = function(component) {
    this._component = component;
  };
  ReactTestInstance.prototype.getInstance = function() {
    return this._component._renderedComponent.getPublicInstance();
  };
  ReactTestInstance.prototype.toJSON = function() {
    var inst = getHostComponentFromComposite(this._component);
    return inst.toJSON();
  };
  var ReactHostMount = {render: function(nextElement) {
      var nextWrappedElement = new ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement);
      var instance = instantiateReactComponent(nextWrappedElement, false);
      ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, instance);
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation.debugTool.onMountRootComponent(instance._renderedComponent._debugID);
      }
      return new ReactTestInstance(instance);
    }};
  module.exports = ReactHostMount;
})(require('process'));
