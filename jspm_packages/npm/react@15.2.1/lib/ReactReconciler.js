/* */ 
(function(process) {
  'use strict';
  var _prodInvariant = require('./reactProdInvariant');
  var ReactRef = require('./ReactRef');
  var ReactInstrumentation = require('./ReactInstrumentation');
  var invariant = require('fbjs/lib/invariant');
  function attachRefs() {
    ReactRef.attachRefs(this, this._currentElement);
  }
  var ReactReconciler = {
    mountComponent: function(internalInstance, transaction, hostParent, hostContainerInfo, context) {
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onBeforeMountComponent(internalInstance._debugID, internalInstance._currentElement);
          ReactInstrumentation.debugTool.onBeginReconcilerTimer(internalInstance._debugID, 'mountComponent');
        }
      }
      var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context);
      if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
        transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
      }
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onEndReconcilerTimer(internalInstance._debugID, 'mountComponent');
          ReactInstrumentation.debugTool.onMountComponent(internalInstance._debugID);
        }
      }
      return markup;
    },
    getHostNode: function(internalInstance) {
      return internalInstance.getHostNode();
    },
    unmountComponent: function(internalInstance, safely) {
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onBeginReconcilerTimer(internalInstance._debugID, 'unmountComponent');
        }
      }
      ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
      internalInstance.unmountComponent(safely);
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onEndReconcilerTimer(internalInstance._debugID, 'unmountComponent');
          ReactInstrumentation.debugTool.onUnmountComponent(internalInstance._debugID);
        }
      }
    },
    receiveComponent: function(internalInstance, nextElement, transaction, context) {
      var prevElement = internalInstance._currentElement;
      if (nextElement === prevElement && context === internalInstance._context) {
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onBeforeUpdateComponent(internalInstance._debugID, nextElement);
          ReactInstrumentation.debugTool.onBeginReconcilerTimer(internalInstance._debugID, 'receiveComponent');
        }
      }
      var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);
      if (refsChanged) {
        ReactRef.detachRefs(internalInstance, prevElement);
      }
      internalInstance.receiveComponent(nextElement, transaction, context);
      if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
        transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
      }
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onEndReconcilerTimer(internalInstance._debugID, 'receiveComponent');
          ReactInstrumentation.debugTool.onUpdateComponent(internalInstance._debugID);
        }
      }
    },
    performUpdateIfNecessary: function(internalInstance, transaction, updateBatchNumber) {
      if (internalInstance._updateBatchNumber !== updateBatchNumber) {
        !(internalInstance._updateBatchNumber == null || internalInstance._updateBatchNumber === updateBatchNumber + 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'performUpdateIfNecessary: Unexpected batch number (current %s, pending %s)', updateBatchNumber, internalInstance._updateBatchNumber) : _prodInvariant('121', updateBatchNumber, internalInstance._updateBatchNumber) : void 0;
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onBeginReconcilerTimer(internalInstance._debugID, 'performUpdateIfNecessary');
          ReactInstrumentation.debugTool.onBeforeUpdateComponent(internalInstance._debugID, internalInstance._currentElement);
        }
      }
      internalInstance.performUpdateIfNecessary(transaction);
      if (process.env.NODE_ENV !== 'production') {
        if (internalInstance._debugID !== 0) {
          ReactInstrumentation.debugTool.onEndReconcilerTimer(internalInstance._debugID, 'performUpdateIfNecessary');
          ReactInstrumentation.debugTool.onUpdateComponent(internalInstance._debugID);
        }
      }
    }
  };
  module.exports = ReactReconciler;
})(require('process'));
