import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  articlesSorting: ['order'],
  articlesSorted: sort('articles', 'articlesSorting'),
});
