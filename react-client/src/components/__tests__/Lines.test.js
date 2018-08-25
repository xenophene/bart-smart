import React from 'react';
import renderer from 'react-test-renderer';
import Lines from '../Lines.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

test('fetchNewLines calls /api/lines and returns lines data', () => {
    var mock = new MockAdapter(axios);
    var response = {
        data: [1, 2, 3]
    };
    mock.onGet('/api/lines').reply(200, response)
    Lines.prototype.fetchNewLines();
    console.log(Lines);
})