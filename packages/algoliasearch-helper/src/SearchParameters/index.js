"use strict";
var keys = require( "lodash/object/keys" );
var intersection = require( "lodash/array/intersection" );
var forEach = require( "lodash/collection/forEach" );
var reduce = require( "lodash/collection/reduce" );
var isEmpty = require( "lodash/lang/isEmpty" );
var isUndefined = require( "lodash/lang/isUndefined" );
var isString = require( "lodash/lang/isString" );

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
   * @see https://www.algolia.com/doc#queryType
   * @member {string}
   */
  this.queryType = params.queryType;
  /**
   * Possible values : true, false, min, strict
   * @see https://www.algolia.com/doc#typoTolerance
   * @member {string}
   */
  this.typoTolerance = params.typoTolerance;

  /**
   * @see https://www.algolia.com/doc#minWordSizefor1Typo
   * @member {number}
   */
  this.minWordSizefor1Typo = params.minWordSizefor1Typo;
  /**
   * @see https://www.algolia.com/doc#minWordSizefor2Typos
   * @member {number}
   */
  this.minWordSizefor2Typos = params.minWordSizefor2Typos;
  /**
   * @see https://www.algolia.com/doc#allowTyposOnNumericTokens
   * @member {boolean}
   */
  this.allowTyposOnNumericTokens = params.allowTyposOnNumericTokens;
  /**
  * @see https://www.algolia.com/doc#ignorePlurals
  * @member {boolean}
  */
  this.ignorePlurals = params.ignorePlurals;
  /**
  * @see https://www.algolia.com/doc#restrictSearchableAttributes
  * @member {string}
  */
  this.restrictSearchableAttributes = params.restrictSearchableAttributes;
  /**
  * @see https://www.algolia.com/doc#advancedSyntax
  * @member {boolean}
  */
  this.advancedSyntax = params.advancedSyntax;
  /**
   * @see https://www.algolia.com/doc#analytics
   * @member {boolean}
   */
  this.analytics = params.analytics;
  /**
   * @see https://www.algolia.com/doc#analyticsTags
   * @member {string}
   */
  this.analyticsTags = params.analyticsTags;
  /**
   * @see https://www.algolia.com/doc#synonyms
   * @member {boolean}
   */
  this.synonyms = params.synonyms;
  /**
   * @see https://www.algolia.com/doc#replaceSynonymsInHighlight
   * @member {boolean}
   */
  this.replaceSynonymsInHighlight = params.replaceSynonymsInHighlight;
  /**
   * @see https://www.algolia.com/doc#optionalWords
   * @member {string}
   */
  this.optionalWords = params.optionalWords;
  /**
   * possible values are "lastWords" "firstWords" "allOptionnal" "none" (default)
   * @see https://www.algolia.com/doc#removeWordsIfNoResults
   * @member {string}
   */
  this.removeWordsIfNoResults = params.removeWordsIfNoResults;
  /**
   * @see https://www.algolia.com/doc#attributesToRetrieve
   * @member {string}
   */
  this.attributesToRetrieve = params.attributesToRetrieve;
  /**
   * @see https://www.algolia.com/doc#attributesToHighlight
   * @member {string}
   */
  this.attributesToHighlight = params.attributesToHighlight;
  /**
   * @see https://www.algolia.com/doc#attributesToSnippet
   * @member {string}
   */
  this.attributesToSnippet = params.attributesToSnippet;
  /**
   * @see https://www.algolia.com/doc#getRankingInfo
   * @member {integer}
   */
  this.getRankingInfo = params.getRankingInfo;
  /**
   * @see https://www.algolia.com/doc#tagFilters
   * @member {string}
   */
  this.tagFilters = params.tagFilters;
  /**
   * @see https://www.algolia.com/doc#distinct
   * @member {boolean}
   */
  this.distinct = params.distinct;
  /**
   * @see https://www.algolia.com/doc#aroundLatLng
   * @member {string}
   */
  this.aroundLatLng = params.aroundLatLng;
  /**
   * @see https://www.algolia.com/doc#aroundLatLngViaIP
   * @member {boolean}
   */
  this.aroundLatLngViaIP = params.aroundLatLngViaIP;
  /**
   * @see https://www.algolia.com/doc#aroundRadius
   * @member {number}
   */
  this.aroundRadius = params.aroundRadius;
  /**
   * @see https://www.algolia.com/doc#aroundPrecision
   * @member {number}
   */
  this.aroundPrecision = params.aroundPrecision;
  /**
   * @see https://www.algolia.com/doc#insideBoundingBox
   * @member {string}
   */
  this.insideBoundingBox = params.insideBoundingBox;
};

SearchParameters.prototype = {
  constructor : SearchParameters,

  /**
   * Remove all refinements (disjunctive + conjunctive + excludes + numeric filters)
   * @method
   * @param {string} [name] - If given, name of the facet / attribute on which  we want to remove all refinements
   * @return {AlgoliaSearchHelper}
   */
  clearRefinements : function clearRefinements( name ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      m._clearNumericRefinements( name );
      m._clearFacetRefinements( name );
      m._clearExcludeRefinements( name );
      m._clearDisjunctiveFacetRefinements( name );
    } );
  },
  /**
   * Query setter
   * @method
   * @param {string} newQuery value for the new query
   * @return {SearchParameters}
   */
  setQuery : function setQuery( newQuery ) {
    return this.mutateMe( function( m ) {
      m.query = newQuery;
      m.page = 0;
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
      m.hitsPerPage = n;
      m.page = 0;
    } );
  },

  /**
   * typoTolerance setter
   * Set the value of typoTolerance
   * @method
   * @param {string} s string new value of typoTolerance ("true", "false", "min" or "strict")
   * @return {SearchParameters}
   */
  setTypoTolerance : function setTypoTolerance( s ) {
    return this.mutateMe( function( m ) {
      m.typoTolerance = s;
      m.page = 0;
    } );
  },
  /**
   * Add or update a numeric filter for a given attribute
   * Current limitation of the numeric filters : you can't have more than one value
   * filtered for each (attribute, oprator). It means that you can't have a filter
   * for ( "attribute", "=", 3 ) and ( "attribute", "=", 8 )
   * @method
   * @param {string} attribute attribute to set the filter on
   * @param {string} operator operator of the filter ( possible values : =, >, >=, <, <=, != )
   * @param {number} value value of the filter
   */
  addNumericRefinement : function( attribute, operator, value ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      if( !m.numericRefinements[ attribute ] ) {
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
   */
  removeNumericRefinement : function( attribute, operator ) {
    return this.mutateMe( function( m ) {
      if( m.numericRefinements[ attribute ] ) {
        m.page = 0;
        var value = m.numericRefinements[ attribute ][ operator ];
        if( !isUndefined( value ) ) {
          delete m.numericRefinements[ attribute ][ operator ];
          if( isEmpty( m.numericRefinements[ attribute ] ) ) {
            delete m.numericRefinements[ attribute ];
          }
        }
      }
    } );
  },
  /**
   * Return the current refinement for the ( attribute, operator )
   * @param {string} attribute of the record
   * @param {string} operator applied
   * @return {number} value of the refinement
   */
  getNumericRefinement : function( attribute, operator ) {
    return this.numericRefinements[ attribute ] && this.numericRefinements[ attribute ][ operator ];
  },
  /**
   * Clear numeric filters.
   * @method
   * @private
   * @param {string} [attribute] -
   * - If not given, means to clear all the filters.
   * - If `string`, means to clear all refinements for the `attribute` named filter.
   */
  _clearNumericRefinements : function _clearNumericRefinements( attribute ) {
    if ( isUndefined( attribute ) ) {
      this.numericRefinements = {};
    }
    else if ( isString( attribute ) ) {
      if ( !isUndefined( this.numericRefinements[ attribute ] ) ) {
        delete this.numericRefinements[ attribute ];
      }
    }
  },
  /**
   * Add a refinement on a "normal" facet
   * @method
   * @param {string} facet attribute to apply the facetting on
   * @param {string} value value of the attribute
   * @return {SearchParameters}
   */
  addFacetRefinement : function addFacetRefinement( facet, value ) {
    if( this.isFacetRefined( facet, value ) ) {
      return this;
    }

    return this.mutateMe( function( m ) {
      m.page = 0;
      if( !m.facetsRefinements[ facet ] ) {
        m.facetsRefinements[ facet ] = [];
      }
      m.facetsRefinements[ facet ].push( value );
    } );
  },
  /**
   * Exclude a value from a "normal" facet
   * @method
   * @param {string} facet attribute to apply the exclusion on
   * @param {string} value value of the attribute
   * @return {SearchParameters}
   */
  addExcludeRefinement : function addExcludeRefinement( facet, value ) {
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
      m.page = 0;
      if( !m.disjunctiveFacetsRefinements[ facet ] ) {
        m.disjunctiveFacetsRefinements[ facet ] = [];
      }
      m.disjunctiveFacetsRefinements[ facet ].push( value );
    } );
  },
  /**
   * Remove a refinement set on facet. If a value is provided, it will clear the
   * refinement for the given value, otherwise it will clear all the refinement
   * values for the facetted attribute.
   * @method
   * @param {string} facet
   * @param {string} value
   * @return {SearchParameters}
   */
  removeFacetRefinement : function removeFacetRefinement( facet, value ) {
    return this.mutateMe( function( m ) {
      m.page = 0;
      if( value ) {
        var idx = m.facetsRefinements[ facet ].indexOf( value );
        if( idx > -1 ) {
          m.facetsRefinements[ facet ].splice( idx, 1 );
          if( m.facetsRefinements[ facet ].length === 0 ) {
            delete m.facetsRefinements[ facet ];
          }
        }
      }
      else {
        m._clearFacetRefinements( facet );
      }
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
        if( idx > -1 ) {
          m.facetsExcludes[ facet ].splice( idx, 1 );
          if( m.facetsExcludes[ facet ].length === 0 ) {
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
        if( idx > -1 ) {
          m.disjunctiveFacetsRefinements[ facet ].splice( idx, 1 );
          if( m.disjunctiveFacetsRefinements[facet].length === 0 ) {
            delete m.disjunctiveFacetsRefinements[ facet ];
          }
        }
      }
    } );
  },
  /**
   * Clear the facet refinements
   * @method
   * @private
   * @param {string} [facet] -
   * - If not given, means to clear the refinement of all facets.
   * - If `string`, means to clear the refinement for the `facet` named facet.
   */
  _clearFacetRefinements : function _clearFacetRefinements( facet ) {
    if ( isUndefined( facet ) ) {
      this.facetsRefinements = {};
    }
    else if ( isString( facet ) ) {
      if ( !isUndefined( this.facetsRefinements[ facet ] ) ) {
        delete this.facetsRefinements[ facet ];
      }
    }
  },
  /**
   * Clear the exclude refinements
   * @method
   * @private
   * @param {string} [facet] -
   * - If not given, means to clear all the excludes of all facets.
   * - If `string`, means to clear all the excludes for the `facet` named facet.
   */
  _clearExcludeRefinements : function _clearExcludeRefinements( facet ) {
    if ( isUndefined( facet ) ) {
      this.facetsExcludes = {};
    }
    else if ( isString( facet ) ) {
      if ( !isUndefined( this.facetsExcludes[ facet ] ) ) {
        delete this.facetsExcludes[ facet ];
      }
    }
  },
  /**
   * Clear the disjunctive refinements
   * @method
   * @private
   * @param {string} [facet] -
   * - If not given, means to clear all the refinements of all disjunctive facets.
   * - If `string`, means to clear all the refinements for the `facet` named facet.
   */
  _clearDisjunctiveFacetRefinements : function _clearDisjunctiveFacetRefinements( facet ) {
    if ( isUndefined( facet ) ) {
      this.disjunctiveFacetsRefinements = {};
    }
    else if ( isString( facet ) ) {
      if ( !isUndefined( this.disjunctiveFacetsRefinements[ facet ] ) ) {
        delete this.disjunctiveFacetsRefinements[ facet ];
      }
    }
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
      return this.removeFacetRefinement( facet, value );
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
   * Test if the facet name is from one of the disjunctive facets
   * @method
   * @param {string} facet facet name to test
   * @return boolean
   */
  isDisjunctiveFacet : function( facet ) {
    return this.disjunctiveFacets.indexOf( facet ) > -1;
  },
  /**
   * Test if the facet name is from one of the conjunctive/normal facets
   * @method
   * @param {string} facet facet name to test
   * @return boolean
   */
  isConjunctiveFacet : function( facet ) {
    return this.facets.indexOf( facet ) > -1;
  },
  /**
   * Returns true if the facet is refined, either for a specific value or in
   * general.
   * @method
   * @param {string} facet name of the attribute for used for facetting
   * @param {string} value, optionnal value. If passed will test that this value
   * is filtering the given facet.
   * @return {boolean} returns true if refined
   */
  isFacetRefined : function isFacetRefined( facet, value ) {
    var containsRefinements = this.facetsRefinements[ facet ] &&
                              this.facetsRefinements[ facet ].length > 0;
    if( value === undefined ) {
      return containsRefinements;
    }

    return containsRefinements &&
           this.facetsRefinements[ facet ].indexOf( value ) !== -1;
  },
  /**
   * Returns true if the facet contains exclusions or if a specific value is
   * excluded
   * @method
   * @param {string} facet name of the attribute for used for facetting
   * @param {string} value, optionnal value. If passed will test that this value
   * is filtering the given facet.
   * @return {boolean} returns true if refined
   */
  isExcludeRefined : function isExcludeRefined( facet, value ) {
    var containsRefinements = this.facetsExcludes[ facet ] &&
                              this.facetsExcludes[ facet ].length > 0;
    if( value === undefined ) {
      return containsRefinements;
    }

    return containsRefinements &&
           this.facetsExcludes[ facet ].indexOf( value ) !== -1;
  },
  /**
   * Returns true if the facet contains a refinement, or if a value passed is a
   * refinement for the facet.
   * @method
   * @param {string} facet name of the attribute for used for facetting
   * @param {string} value optionnal, will test if the value is used for refinement
   * if there is one, otherwise will test if the facet contains any refinement
   * @return {boolean}
   */
  isDisjunctiveFacetRefined : function isDisjunctiveFacetRefined( facet, value ) {
    var containsRefinements = this.disjunctiveFacetsRefinements[ facet ] &&
                              this.disjunctiveFacetsRefinements[ facet ].length > 0;
    if( value === undefined ) {
      return containsRefinements;
    }

    return containsRefinements &&
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
    var disjunctiveNumericRefinedFacets = intersection(
      keys( this.numericRefinements ),
      this.disjunctiveFacets
    );
    return keys( this.disjunctiveFacetsRefinements ).concat( disjunctiveNumericRefinedFacets );
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
  getQueryParams : function getQueryParams() {
    var managedParameters = this.managedParameters;
    return reduce( this, function( memo, value, parameter, parameters ) {
      if( managedParameters.indexOf( parameter ) === -1 &&
          parameters[ parameter ] !== undefined ) {
        memo[ parameter ] = value;
      }
      return memo;
    }, {} );
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
  },
  /**
   * Let the user set a specific value for a given parameter. Will return the
   * same instance if the parameter is invalid or if the value is the same as the
   * previous one.
   * @method
   * @param {string} parameter the parameter name
   * @param {any} value the value to be set, must be compliant with the definition of the attribute on the object
   * @return {SearchParameters} the updated state
   */
  setQueryParameter : function setParameter( parameter, value ) {
    var k = keys( this );
    if( k.indexOf( parameter ) === -1 ) {
      throw new Error( "Property " + k + " is not defined on SearchParameters (see http://algolia.github.io/algoliasearch-helper-js/docs/SearchParameters.html )" );
    }
    if( this[ parameter ] === value ) return this;

    return this.mutateMe( function updateParameter( newState ) {
      newState[ parameter ] = value;
      return newState;
    } );
  },
  /**
   * Let the user set any of the parameters with a plain object.
   * It won't let the user define custom properties.
   * @method
   * @param {object} params all the keys and the values to be updated
   * @return {SearchParameters} a new updated instance
   */
  setQueryParameters : function setQueryParameters( params ) {
    return this.mutateMe( function merge( newInstance ) {
      var ks = keys( params );
      forEach( ks, function( k ) {
        if( !newInstance.hasOwnProperty( k ) ) {
          throw new Error( "Property " + k + " is not defined on SearchParameters (see http://algolia.github.io/algoliasearch-helper-js/docs/SearchParameters.html )" );
        }

        newInstance[ k ] = params[ k ];
      } );
      return newInstance;
    } );
  }
};

module.exports = SearchParameters;
