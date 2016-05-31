'use strict';

jest.dontMock('../gridFilter');

var React = require('react/addons');
var GridFilter = require('../gridFilter');
var TestUtils = React.addons.TestUtils;

describe('GridFilter', function () {
	var filter;
	beforeEach(function () {
		filter = TestUtils.renderIntoDocument(React.createElement(GridFilter, null));
	});

	it('calls change filter when clicked', function () {
		var mock = jest.genMockFunction();
		filter.props.changeFilter = mock;

		var someEvent = {
			"target": {
				"value": "hi"
			}
		};

		var input = TestUtils.findRenderedDOMComponentWithTag(filter, 'input');
		React.addons.TestUtils.Simulate.change(input, someEvent);

		expect(mock.mock.calls).toEqual([["hi"]]);
	});
});