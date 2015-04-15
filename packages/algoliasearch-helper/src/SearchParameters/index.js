"use strict";
var keys = require( "lodash/object/keys" );
var forEach = require( "lodash/collection/forEach" );
var reduce = require( "lodash/collection/reduce" );
var isEmpty = require( "lodash/lang/isEmpty" );

/**
 * @typedef FacetList
 * @type {Array.<string>}
 *
 * @typedef OperatorList
 * @type {Object.<string, number>}
 */

/**
 * SearchParameters is the data structure that contains all the informations
 * usable for making a search to Algolia API. It doesn't do the search itself,
 * nor does it contains logic about the parameters.
 * It is an immutable object, therefore it has been created in a way that each
 * "mutation" does not mutate the object itself but returns a copy with the
 * modification.
 * This object should probably not be instantiated outside of the helper. It will
 * be provided when needed. This object is documented for reference as you'll
 * get it from events generated by the {Helper}.
 * @constructor
 * @classdesc contains all the parameters of a search
 */
var SearchParameters = function( newParameters ) {
  var params = newParameters || {};
  //Query
  /**
   * Query used for the search.
   * @member {string}
   */
  this.query = params.query || "";
  //Facets
  /**
   * All the facets that will be requested to the server
   * @member {Object.<string, string>}
   */
  this.facets = params.facets || [];
  /**
   * All the declared disjunctive facets
   * @member {Object.<string, string>}
   */
  this.disjunctiveFacets = params.disjunctiveFacets || [];
  //Refinements
  /** @member {Object.<string, FacetList>}*/
  this.facetsRefinements = params.facetsRefinements || {};
  /** @member {Object.<string, FacetList>}*/
  this.facetsExcludes = params.facetsExcludes || {};
  /** @member {Object.<string, FacetList>}*/
  this.disjunctiveFacetsRefinements = params.disjunctiveFacetsRefinements || {};
  /**
   * @member {Object.<string, OperatorList>}
   */
  this.numericRefinements = params.numericRefinements || {};
  //Misc. parameters
  /** @member {number} */
  this.hitsPerPage = params.hitsPerPage || 20;
  /**
   * @member {number} 
   **/
  this.maxValuesPerFacet = params.maxValuesPerFacet || 10;
  /** @member {number} */
  this.page = params.page || 0;

  /**
   * Possible values : prefixAll, prefixLast, prefixNone
   * @member {string}
   */
  this.queryType = params.queryType;
  /**
   * Possible values : true, false, min, strict
   * @member {string}
   */
  this.typoTolerance = params.typoTolerance;

  this.minWordSizefor1Typo = params.minWordSizefor1Typo;
  this.minWordSizefor2Typos = params.minWordSizefor2Typos;
  this.allowTyposOnNumericTokens = params.allowTyposOnNumericTokens;
  this.ignorePlurals = params.ignorePlurals;
  this.restrictSearchableAttributes = params.restrictSearchableAttributes;
  this.advancedSyntax = params.advancedSyntax;
  this.analytics = params.analytics;
  this.analyticsTags = params.analyticsTags;
  this.synonyms = params.synonyms;
  this.replaceSynonymsInHighlight = params.replaceSynonymsInHighlight;
  this.optionalWords = params.optionalWords;
  this.removeWordsIfNoResults = params.removeWordsIfNoResults;
  this.attributesToRetrieve = params.attributesToRetrieve;
  this.attributesToHighlight = params.attributesToHighlight;
  this.attributesToSnippet = params.attributesToSnippet;
  this.getRankingInfo = params.getRankingInfo;
  this.tagFilters = params.tagFilters;
  this.distinct = params.distinct;
  this.aroundLatLng = params.aroundLatLng;
  this.aroundLatLngViaIP = params.aroundLatLngViaIP;
  this.aroundRadius = params.aroundRadius;
  this.aroundPrecision = params.aroundPrecision;
  this.insideBoundingBox = params.insideBoundingBox;
};

SearchParameters.prototype = {
  constructor : SearchParameters,
  clearRefinements : function clearRefinements() {
    return this.mutateMe( function( m ) {
      m.page = 0;
      m.facetsRefinements = {};
      m.facetsExcludes = {};
      m.disjunctiveFacetsRefinements = {};
      m.numericRefinements = {};
    } );
  },
  /**
   * Query setter
   * @method
   * @param {string} newQuery value for the new query
   * @return {SearchParameters}
   */
  setQuery : function setQuery( newQuery ) {
    return this.mutateMe( function( newState ) {
      newState.query = newQuery;
      newState.page = 0;
    } );
  },
  /**
   * Page setter
   * @method
   * @param {number} newPage new page number
   * @return {SearchParameters}
   */
  setPage : function setPage( newPage ) {
    return this.mutateMe( function( mutable ) {
      mutable.page = newPage;
    } );
  },
  /**
   * Facets setter
   * The facets are the simple facets, used for conjunctive (and) facetting.
   * @method
   * @param {string[]} facets all the attributes of the algolia records used for conjunctive facetting
   * @return {SearchParameters}
   */
  setFacets : function setFacets( facets ) {
    return this.mutateMe( function( m ) {
      m.facets = facets;
    } );
  },
  /**
   * Disjunctive facets setter
   * Change the list of disjunctive (or) facets the helper chan handle.
   * @method
   * @param {string[]} facets all the attributes of the algolia records used for disjunctive facetting
   * @return {SearchParameters}
   */
  setDisjunctiveFacets : function setDisjunctiveFacets( facets ) {
    return this.mutateMe( function( m ) {
      m.disjunctiveFacets = facets;
    } );
  },
  /**
   * HitsPerPage setter
   * Hits per page represents the number of hits retrieved for this query
   * @method
   * @param {number} n number of hits retrieved per page of results
   * @return {SearchParameters}
   */
  setHitsPerPage : function setHitsPerPage( n ) {
    return this.mutateMe( function( m ) {
      m.HitsPerPage = n;
      m.page = 0;
    } );
  },
  /**
   * Add or update a numeric filter for a given attribute
   * @method
   * @param {string} attribute attribute to set the filter on
   * @param {string} operator operator of the filter ( possible values : =, >, >=, <, <=, != )
   * @param {number} value value of the filter
   */
  addNumericRefinement : function( attribute, operator, value ) {
    return this.mutateMe( function( m ){
      m.page = 0;
      if( !m.numericRefinements[ attribute ] ){
        m.numericRefinements[ attribute ] = {};
      }
      m.numericRefinements[ attribute ][ operator ] = value;
    } );
  },
  /**
   * Remove a numeric filter
   * @method
   * @param {string} attribute attribute to set the filter on
   * @param {string} operator operator of the filter ( possible values : =, >, >=, <, <=, != )
   * @param {number} value value of the filter
   */
  removeNumericRefinement : function( attribute, operator, value ) {
    return this.mutateMe( function( m ) {
      if( m.numericRefinements[ attribute ] ) {
        m.page = 0;
        var value = m.numericRefinements[ attribute ][ operator ];
        if( value ) {
          delete m.numericRefinements[ attribute ][ operator ];
          if( isEmpty( m.numericRefinements[ attribute ] ) ){
            delete m.numericRefinements[ attribute ];
          }
        }
      }
    } );
  },
  /**
   * Add a refinement on a "normal" facet
   * @method
   * @param {string} facet attribute to apply the facetting on
   * @param {string} value value of the attribute
   * @return {SearchParameters}
   */
  addFacetRefinement : function addFacetRefinement( facet, value ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      m.facetsRefinements[ facet ] = value;
    } );
  },
  /**
   * Exclude a value from a "normal" facet
   * @method
   * @param {string} facet attribute to apply the exclusion on
   * @param {string} value value of the attribute
   * @return {SearchParameters}
   */
  addExcludeRefinement : function addExcludedValue( facet, value ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      if( !m.facetsExcludes[ facet ] ) {
        m.facetsExcludes[ facet ] = [];
      }
      m.facetsExcludes[ facet ].push( value );
    } );
  },
  /**
   * Adds a refinement on a disjunctive facet.
   * @method
   * @param {string} facet attribute to apply the facetting on
   * @param {string} value value of the attribute
   * @return {SearchParameters}
   */
  addDisjunctiveFacetRefinement : function addDisjunctiveFacetRefinement( facet, value ) {
    return this.mutateMe( function( m ) {
      m.page=0;
      if( !m.disjunctiveFacetsRefinements[ facet ] ) {
        m.disjunctiveFacetsRefinements[ facet ] = [];
      }
      m.disjunctiveFacetsRefinements[ facet ].push( value );
    } );
  },
  /**
   * Remove a refinement set on facet.
   * @method
   * @param {string} facet
   * @return {SearchParameters}
   */
  removeFacetRefinement : function removeFacetRefinement( facet ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      delete m.facetsRefinements[ facet ];
    } );
  },
  /**
   * Remove a negative refinement on a facet
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {SearchParameters}
   */
  removeExcludeRefinement : function removeExcludeRefinement( facet, value ) {
    return this.mutateMe( function( m ) {
      if( m.facetsExcludes[ facet ] ) {
        m.page = 0;
        var idx = m.facetsExcludes[ facet ].indexOf( value );
        if( idx > -1 ){
          m.facetsExcludes[ facet ].splice( idx, 1 );
          if( m.facetsExcludes[ facet ].length === 0 ){
            delete m.facetsExcludes[ facet ];
          }
        }
      }
    } );
  },
  /**
   * Remove a refinement on a disjunctive facet
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {SearchParameters}
   */
  removeDisjunctiveFacetRefinement : function removeDisjunctiveFacetRefinement( facet, value ) {
    return this.mutateMe( function( m ) {
      if( m.disjunctiveFacetsRefinements[ facet ] ) {
        m.page = 0;
        var idx = m.disjunctiveFacetsRefinements[ facet ].indexOf( value );
        if( idx > -1 ){
          m.disjunctiveFacetsRefinements[ facet ].splice( idx, 1 );
          if( m.disjunctiveFacetsRefinements[facet].length === 0 ){
            delete m.disjunctiveFacetsRefinements[ facet ];
          }
        }
      }
    } );
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet
   * @param {value} value
   * @return {SearchParameters}
   */
  toggleFacetRefinement : function toggleFacetRefinement( facet, value ) {
    if( this.isFacetRefined( facet, value ) ) {
      return this.removeFacetRefinement( facet );
    }
    else {
      return this.addFacetRefinement( facet, value );
    }
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet
   * @param {value} value
   * @return {SearchParameters}
   */
  toggleExcludeFacetRefinement : function toggleExcludeFacetRefinement( facet, value ) {
    if( this.isExcludeRefined( facet, value ) ) {
      return this.removeExcludeRefinement( facet, value );
    }
    else {
      return this.addExcludeRefinement( facet, value );
    }
  },
  /**
   * Switch the refinement applied over a facet/value
   * @method
   * @param {string} facet
   * @param {value} value
   * @return {SearchParameters}
   */
  toggleDisjunctiveFacetRefinement : function toggleDisjunctiveFacetRefinement( facet, value ) {
    if( this.isDisjunctiveFacetRefined( facet, value ) ) {
      return this.removeDisjunctiveFacetRefinement( facet, value );
    }
    else {
      return this.addDisjunctiveFacetRefinement( facet, value );
    }
  },
  /**
   * Returns true if the couple (facet, value) is refined
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {boolean}
   */
  isFacetRefined : function isFacetRefined( facet, value ) {
    return this.facetsRefinements[ facet ] === value;
  },
  /**
   * Returns true if the couple (facet, value) is excluded
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {boolean}
   */
  isExcludeRefined : function isExcludeRefined( facet, value ) {
    return this.facetsExcludes[ facet ] &&
           this.facetsExcludes[ facet ].indexOf( value ) !== -1;
  },
  /**
   * Returns true if the couple (facet, value) is refined
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {boolean}
   */
  isDisjunctiveFacetRefined : function isDisjunctiveFacetRefined( facet, value ) {
    return this.disjunctiveFacetsRefinements[ facet ] &&
           this.disjunctiveFacetsRefinements[ facet ].indexOf( value ) !== -1;
  },
  /**
   * Returns the list of all disjunctive facets refined
   * @method
   * @param {string} facet
   * @param {value} value
   * @return {string[]}
   */
  getRefinedDisjunctiveFacets : function getRefinedDisjunctiveFacets() {
    return keys( this.disjunctiveFacetsRefinements );
  },
  /**
   * Returned the list of all disjunctive facets not refined
   * @method
   * @return {string[]}
   */
  getUnrefinedDisjunctiveFacets : function() {
    var unrefinedFacets = [];
    var refinedFacets = this.getRefinedDisjunctiveFacets();
    forEach( this.disjunctiveFacets, function( f ) {
      if( refinedFacets.indexOf( f ) === -1 ) {
        unrefinedFacets.push( f );
      }
    } );
    return unrefinedFacets;
  },
  managedParameters : [
    "facets", "disjunctiveFacets", "facetsRefinements",
    "facetsExcludes", "disjunctiveFacetsRefinements",
    "numericRefinements" 
  ],
  getQueryParams : function getQueryParams(){
    var managedParameters = this.managedParameters;
    return reduce( this, function( memo, value, parameter, parameters) {
      if( managedParameters.indexOf( parameter ) === -1 &&
          parameters[ parameter ] !== undefined ){
        memo[ parameter ] = value;
      };
      return memo;
    }, {});
  },
  /**
   * Helper function to make it easier to build new instances from a mutating
   * function
   * @private
   */
  mutateMe : function mutateMe( fn ) {
    var newState = new ( this.constructor )( this );
    fn( newState );
    return Object.freeze( newState );
  }
};

module.exports = SearchParameters;
