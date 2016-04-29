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
import "can-connect/data/localstorage-cache/";
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

export const <%= className %> = can.Map.extend(<%= className %>, {
  define: {}
});

<%= className %>.List = can.List.extend({
  Map: <%= className %>
}, {});

let options = {
  ajax: $.ajax,
  url: '<%= url %>',
  idProp: '<%= idProp %>',
  Map: <%= className %>,
  List: <%= className %>.List,
  name: '<%= name %>'
};

options.cacheConnection= connect(["data-localstorage-cache"],{
  name: "<%= name %>Cache",
  idProp: options.idProp,
  algebra: options.algebra
});

export const <%= name %>Connection = connect(behaviors, options);

tag('<%= name %>-model', <%= name %>Connection);

export default <%= className %>;
