// Modulo de Angular
import { uiModules } from 'ui/modules';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { FilterManagerProvider } from 'ui/filter_manager';
import { tabifyAggResponse } from 'ui/agg_response/tabify/tabify';
import uiselect from 'ui-select';
 
var module = uiModules.get('kibana/combo_3',['ui.select']);

module.controller('KbnDropdownVisController', function ($scope, $rootScope, Private, $filter) {
  var filterManager = Private(FilterManagerProvider);
  var queryFilter = Private(FilterBarQueryFilterProvider);
  
  $rootScope.plugin = {
    dropdownPlugin: {}
  };
  $scope.dropdownValues = []
  $scope.dropdown = {selected: null}
  $scope.disabled = false;
  $scope.config = {
      title: "Dropdown"
  };

  var findFilter = function() {
    var filters = queryFilter.getFilters()
    var fieldParam = $scope.vis.aggs.bySchemaName['dropdownfield'][0].params.field;
    var matchingFilter = filters.find(function(f) {
      return f.meta.key === fieldParam.$$spec.name;
    })
    return matchingFilter
  }

  $scope.onOpenClose = function(isOpenClose) {
    if (isOpenClose) {
      var matchingFilter = findFilter()
      if (matchingFilter) {
        queryFilter.removeFilter(matchingFilter)
      }
    } else if (this.$select.selected) {
      $scope.filter(this.$select.selected.key || this.$select.selected)
    }
  }
  $scope.filter = function(val) {
    console.log("filtering on ", val)
    if (val) {
     var fieldParam = $scope.vis.aggs.bySchemaName['dropdownfield'][0].params.field;
      filterManager.add(
        fieldParam,
        val,
        null,
        $scope.vis.indexPattern.id
      );
    }
  };

  $scope.addFilter = function(label){
    const filterManager = Private(FilterManagerProvider);
    $scope.addFilter = function(label){
      filterManager.add(
        $scope.vis.aggs.bySchemaName['tags'][0].params.filed,
        label,
        null,
        $scope.vis.indexPattern.title
        );
    }
  }

  $scope.$watch('vis.params.title', function (title) {
    $scope.config.title = title;
  });
  var findInDropdown = function (d) {
      return d.key === $scope.dropdown.selected
  }
  $scope.$watch('esResponse', function (resp) {
    if (resp && resp.aggregations) {
      $scope.dropdownValues = Object.values(resp.aggregations[2].buckets).map(function(a) {
        return a;
      })

      var matchingFilter = findFilter()
      // if there is no matching filter, clear the dropdown selection
      if ($scope.vis.params.allowBlank && !matchingFilter) {
        $scope.dropdown.selected = null;
      }
      // if there is a matching filter make sure it matches the selection
      if (matchingFilter) {
        $scope.dropdown.selected = matchingFilter.meta.value;
      }
      // the selected thing might not be in the dropdownValues anymore
      // select the first thing in the list if nothing else is selected
      var found = $scope.dropdownValues.find(findInDropdown)
      if (!$scope.vis.params.allowBlank && !found) {
        if ($scope.dropdownValues[0]) {
         $scope.dropdown.selected = $scope.dropdownValues[0].key;
         $scope.filter($scope.dropdownValues[0].key);
        }

       
      } 
    }
  });
});