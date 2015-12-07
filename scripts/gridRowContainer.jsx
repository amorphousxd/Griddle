/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridRow = require('./gridRow');
var ColumnProperties = require('./columnProperties');
var _ = require('underscore');
var assign = require('object-assign');

function traverseChildren(root, rootId = 0, level = 0) {
  var result = [];

  root = assign({$$id: rootId + 1, $$parentId: rootId === 0 ? void 0 : rootId, $$level: level}, root)
  result.push(root);

  if (Array.isArray(root.children) && root.children.length > 0) {
    result = root.children.reduce(function (acc, child) {
      return acc.concat(traverseChildren(child, root.$$id, level + 1));
    }, result);
  }

  return result;
}

var GridRowContainer = React.createClass({
    getDefaultProps: function(){
      return {
        "useGriddleStyles": true,
        "useGriddleIcons": true,
        "isSubGriddle": false,
        "columnSettings": null,
        "rowSettings": null,
        "paddingHeight": null,
        "rowHeight": null,
        "parentRowCollapsedClassName": "parent-row",
        "parentRowExpandedClassName": "parent-row expanded",
        "parentRowCollapsedComponent": "▶",
        "parentRowExpandedComponent": "▼",
        "simpleRowComponent": " ",
        "onRowClick": null
      };
    },
    getInitialState: function(){
      return {
        data: {},
        showChildren: []
      }
    },
    componentWillReceiveProps: function(){
      this.setShowChildren([]);
    },
    toggleChildren: function (parentId) {
      var {showChildren} = this.state;
      console.log(parentId);
      if (showChildren.indexOf(parentId) >= 0) {
        this.setShowChildren(_.without(showChildren, parentId));
      } else {
        this.setShowChildren(showChildren.concat([parentId]));
      }
    },
    setShowChildren: function(visible){
      this.setState({
        showChildren: visible
      });
    },
    verifyProps: function(){
      if(this.props.columnSettings === null){
        console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
      }
    },
    rowHasChildren: function (row) {
      return row.children && row.children.length > 0;
    },
    rowHasShownChildren: function (row) {
      console.log(row.$$id, this.state.showChildren)
      return this.state.showChildren.indexOf(row.$$id) >= 0;
    },
    render: function() {
      this.verifyProps();

      if(typeof this.props.data === "undefined"){return (<tbody></tbody>);}
      var arr = traverseChildren(this.props.data)
        .filter((row) => typeof row.$$parentId === 'undefined' || this.state.showChildren.indexOf(row.$$parentId) >= 0)
        .map((row, index) => {
          return <GridRow key={index} useGriddleStyles={this.props.useGriddleStyles} data={row} columnSettings={this.props.columnSettings}
            rowSettings={this.props.rowSettings} hasChildren={this.rowHasChildren(row)} toggleChildren={this.toggleChildren.bind(this, row.$$id)}
            isChildRow={!!row.$$parentId} showChildren={this.rowHasShownChildren(row)} useGriddleIcons={this.props.useGriddleIcons}
            parentRowExpandedClassName={this.props.parentRowExpandedClassName} parentRowCollapsedClassName={this.props.parentRowCollapsedClassName}
            parentRowExpandedComponent={this.props.parentRowExpandedComponent} parentRowCollapsedComponent={this.props.parentRowCollapsedComponent}
            simpleRowComponent={this.props.simpleRowComponent}
            paddingHeight={this.props.paddingHeight} rowHeight={this.props.rowHeight} onRowClick={this.props.onRowClick} />
        });

      return <tbody>{arr}</tbody>
    }
});

module.exports = GridRowContainer;
