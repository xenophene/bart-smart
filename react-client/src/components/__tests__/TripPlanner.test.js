import React from 'react';
import TripPlanner from '../TripPlanner.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow, mount } from 'enzyme';

describe('Tests for TripPlanner', () => {

  it('Renders starting and ending stop from Axios call', (done) => {
    const mock = new MockAdapter(axios);
    var data = JSON.stringify({"name":"Dublin/Pleasanton","id":15})
    mock.onGet('/api/stations').reply(200,
      [{id: 1, name: 'Powell', is_favorite: 1}, 
       {id: 2, name: 'Downtown Berkeley', is_favorite: 0}, 
       {id: 3, name: 'Orinda', is_favorite: 1}])
    const wrapper = shallow(<TripPlanner />)
    wrapper.update();
    setTimeout(() => {
      expect(wrapper.find('.selections')).toHaveText('Start:PowellOrindaDowntown BerkeleyEnd:PowellOrindaDowntown BerkeleyGo!')        
      done();
    }, 500);
  })


  it('Renders the list of in between stations', (done) => {
    const wrapper = shallow(<TripPlanner />)
    wrapper.find('select #start').simulate('click', {
      target: { value: 3}
    });
    
    expect(wrapper.find('select #start').length).to.equal(3)
  })
  
 
})