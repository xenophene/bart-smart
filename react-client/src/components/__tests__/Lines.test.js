import React from 'react';
import renderer from 'react-test-renderer';
import Lines from '../Lines.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Enzyme from 'enzyme';
import {shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


test('fetchNewLines calls /api/lines and returns lines data', () => {
    
    const wrapper = render(<Lines />);
    var mock = new MockAdapter(axios);

    var response = [1, 2, 3];
    mock.onGet('/api/lines').reply(200, response)

    Lines.prototype.fetchNewLines();
    const spy = jest.spyOn(mock, 'setState')
    expect(spy).toHaveBeenCalled();
    //expect(wrapper.state().newLines).toBe([1, 2, 3])
    
});
