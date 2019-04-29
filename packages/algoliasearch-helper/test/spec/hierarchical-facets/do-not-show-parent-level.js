'use strict';

test('hierarchical facets: do not show parent level', function(done) {
  var algoliasearch = require('algoliasearch');

  var algoliasearchHelper = require('../../../');

  var appId = 'hierarchical-simple-appId';
  var apiKey = 'hierarchical-simple-apiKey';
  var indexName = 'hierarchical-simple-indexName';

  var client = algoliasearch(appId, apiKey);
  var helper = algoliasearchHelper(client, indexName, {
    hierarchicalFacets: [{
      name: 'categories',
      attributes: ['categories.lvl0', 'categories.lvl1'],
      separator: ' | ',
      showParentLevel: false
    }]
  });

  helper.toggleRefine('categories', 'beers | IPA');

  var algoliaResponse = {
    'results': [{
      'query': 'a',
      'index': indexName,
      'hits': [{'objectID': 'one'}, {'objectID': 'two'}],
      'nbHits': 2,
      'page': 0,
      'nbPages': 1,
      'hitsPerPage': 20,
      'facets': {
        'categories.lvl0': {'beers': 2},
        'categories.lvl1': {'beers | IPA': 2}
      }
    }, {
      'query': 'a',
      'index': indexName,
      'hits': [{'objectID': 'one'}],
      'nbHits': 1,
      'page': 0,
      'nbPages': 1,
      'hitsPerPage': 1,
      'facets': {
        'categories.lvl0': {'beers': 3},
        'categories.lvl1': {'beers | IPA': 2, 'beers | Belgian': 1}
      }
    }, {
      'query': 'a',
      'index': indexName,
      'hits': [{'objectID': 'one'}],
      'nbHits': 1,
      'page': 0,
      'nbPages': 1,
      'hitsPerPage': 1,
      'facets': {
        'categories.lvl0': {'beers': 3}
      }
    }]
  };

  var expectedHelperResponse = [{
    'name': 'categories',
    'count': null,
    'isRefined': true,
    'path': null,
    'data': [{
      'name': 'beers',
      'path': 'beers',
      'count': 3,
      'isRefined': true,
      'data': [{
        'name': 'IPA',
        'path': 'beers | IPA',
        'count': 2,
        'isRefined': true,
        'data': null
      }]
    }]
  }];

  client.search = jest.fn(function() {
    return Promise.resolve(algoliaResponse);
  });

  helper.setQuery('a').search();
  helper.once('result', function(content) {
    expect(client.search).toHaveBeenCalledTimes(1);
    expect(content.hierarchicalFacets).toEqual(expectedHelperResponse);
    done();
  });
});
