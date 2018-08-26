import React from 'react';
import Lines from '../Lines.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow, mount } from 'enzyme';

describe('Tests for Lines component', () => {
  it('Renders Lines from Axios query in Select box by default', (done) => {
    const mock = new MockAdapter(axios);
    // /api/lines returns 2 lines: line1 and line2.
    mock.onGet('/api/lines').reply(200,
      [{id: 1, name: 'line1'}, {id: 2, name: 'line2'}])
    const wrapper = shallow(<Lines />)
    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('option[value=1]')).toHaveText('line1')
      expect(wrapper.find('option[value=2]')).toHaveText('line2')
      done();
    });
  })

  it('Renders Stops for the first line by default', (done) => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/lines').reply(200,
      [{id: 1, name: 'line1'}, {id: 2, name: 'line2'}])
    // Line 1 returns 3 stops: Stop1, Stop2 and Stop3. Stop2 is also
    // a favorite stop.
    mock.onGet('/api/lines/1').reply(200,
      [{id: 1, is_favorite: false, name: 'Stop1'},
       {id: 2, is_favorite: true, name: 'Stop2'},
       {id: 3, is_favorite: false, name: 'Stop3'}])
    const wrapper = shallow(<Lines />)
    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('div.lines-stop-list ul').children().length).toBe(3)
      expect(wrapper.find('.lines-stop-list ul li[value=1]')).toHaveText('Stop1')
      expect(wrapper.find('.lines-stop-list ul li[value=2]')).toHaveText('Stop2  ❤ ')
      expect(wrapper.find('.lines-stop-list ul li[value=3]')).toHaveText('Stop3')
      done();
    });
  })

  it('Select click on new line renders new stop list', (done) => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/lines/3').reply(200,
      [{id: 1, is_favorite: false, name: 'Stop1'},
       {id: 2, is_favorite: true, name: 'Stop2'},
       {id: 3, is_favorite: true, name: 'Stop3'},
       {id: 4, is_favorite: false, name: 'Stop4'}])
    const wrapper = shallow(<Lines />)
    wrapper.find('select').simulate('change', {
      target: { value: '3' }
    });

    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('div.lines-stop-list ul').children().length).toBe(4)
      expect(wrapper.find('.lines-stop-list ul li[value=1]')).toHaveText('Stop1')
      expect(wrapper.find('.lines-stop-list ul li[value=2]')).toHaveText('Stop2  ❤ ')
      expect(wrapper.find('.lines-stop-list ul li[value=3]')).toHaveText('Stop3  ❤ ')
      expect(wrapper.find('.lines-stop-list ul li[value=4]')).toHaveText('Stop4')
      done();
    });
  })

  it('Sets regular stop to favorite stop', (done) => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/lines/1').reply(200,
      [{id: '1', is_favorite: false, name: 'Stop1'},
       {id: '2', is_favorite: true, name: 'Stop2'}]);
    mock.onGet('/api/stops/1').reply(200, true);
    const wrapper = mount(<Lines />)
    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('div.lines-stop-list ul').children().length).toBe(2)
      expect(wrapper.find(".lines-stop-list ul li[value='1']")).toHaveText('Stop1')
      expect(wrapper.find(".lines-stop-list ul li[value='2']")).toHaveText('Stop2  ❤ ');
    });
    process.nextTick(() => {
      wrapper.find(".lines-stop-list ul li[value='1']").simulate('click', {
        target: { value: '1' }
      });
    });
    setTimeout(() => {
      expect(wrapper.find(".lines-stop-list ul li[value='1']")).toHaveText('Stop1  ❤ ');
      expect(wrapper.find(".lines-stop-list ul li[value='2']")).toHaveText('Stop2  ❤ ');
      done();
    }, 1000);
  })

  it('Sets favorite stop to regular stop', (done) => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/lines/1').reply(200,
      [{id: '1', is_favorite: false, name: 'Stop1'},
       {id: '2', is_favorite: true, name: 'Stop2'}]);
    mock.onGet('/api/stops/2').reply(200, false);
    const wrapper = mount(<Lines />)
    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('div.lines-stop-list ul').children().length).toBe(2)
      expect(wrapper.find(".lines-stop-list ul li[value='1']")).toHaveText('Stop1')
      expect(wrapper.find(".lines-stop-list ul li[value='2']")).toHaveText('Stop2  ❤ ');
    });
    process.nextTick(() => {
      wrapper.find(".lines-stop-list ul li[value='2']").simulate('click', {
        target: { value: '2' }
      });
    });
    setTimeout(() => {
      expect(wrapper.find(".lines-stop-list ul li[value='1']")).toHaveText('Stop1');
      expect(wrapper.find(".lines-stop-list ul li[value='2']")).toHaveText('Stop2');
      done();
    }, 1000);
  })
})
