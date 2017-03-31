# donejs-connect-model

[![Greenkeeper badge](https://badges.greenkeeper.io/donejs/donejs-connect-model.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/donejs/donejs-connect-model.svg?branch=master)](https://travis-ci.org/donejs/donejs-connect-model)
[![npm version](https://badge.fury.io/js/donejs-connect-model.svg)](http://badge.fury.io/js/donejs-connect-model)

Generates a more verbose can-connect supermodel, which allows you to more easily customize behaviors.

## Using the generator

To add this generator to your DoneJS application, run

```
donejs add connect-model
```

## Example output
If you run the above command and answer with these options:
```
? The singular name for your model (e.g. order) order
? What is the URL endpoint? /orders
? What is the property name of the id? id
   create src/models/fixtures/order.js
   create src/models/order.js
   create src/models/order_test.js
```

You'll get this output for `order.js`.

```js
import can from 'can';
import $ from 'jquery';
import connect from 'can-connect';
import tag from 'can-connect/can/tag/';
import 'can-connect/constructor/';
import 'can-connect/can/map/';
import 'can-connect/can/';
import 'can-connect/constructor/store/';
import 'can-connect/constructor/callbacks-once/';
import 'can-connect/data/callbacks/';
import 'can-connect/data/callbacks-cache/';
import 'can-connect/data/combine-requests/';
import 'can-connect/data/inline-cache/';
import 'can-connect/data/localstorage-cache/';
import 'can-connect/data/parse/';
import 'can-connect/data/url/';
import 'can-connect/fall-through-cache/';
import 'can-connect/real-time/';
import 'can/map/define/define';

var behaviors = [
  'constructor',
  'can-map',
  'constructor-store',
  'data-callbacks',
  'data-combine-requests',
  'data-inline-cache',
  'data-parse',
  'data-url',
  'constructor-callbacks-once',
  'fall-through-cache'
];

export const Order = can.Map.extend(Order, {
  define: {}
});

Order.List = can.List.extend({
  Map: Order
}, {});

let options = {
  ajax: $.ajax,
  url: '/orders',
  idProp: 'id',
  Map: Order,
  List: Order.List,
  name: 'order'
};

options.cacheConnection= connect(['data-localstorage-cache'],{
  name: 'orderCache',
  idProp: options.idProp,
  algebra: options.algebra
});

export const orderConnection = connect(behaviors, options);

tag('order-model', orderConnection);

export default Order;
```

## Developing

To make changes to this generator, clone the repository and install the dependencies

```
git clone git@github.com:donejs/donejs-connect-model.git
cd donejs-connect-model
npm install
```

Then you can run the tests with

```
npm test
```
