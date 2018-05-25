import React from 'react';
import { mount } from 'enzyme';
import EventCardComponent from
  '../../src/app/components/Event/EventCardComponent.jsx';

describe('event card component', () => {
  const event = {
    id: 1,
    centerId: 1,
    isAccepted: true,
    name: 'Test Event',
    type: 'meeting',
    guests: '20',
    start: '22/05/2018',
    end: '22/05/2018',
    center: {
      id: 1,
      name: 'Test event center',
    },
  };
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<EventCardComponent
    event={event}
    history={history}
  />);
  const eventName = wrapper.find('h6');
  const eventType = wrapper.find('.type');
  const eventGuests = wrapper.find('.guests');
  const eventStart = wrapper.find('.start');
  const eventEnd = wrapper.find('.end');
  const eventCenter = wrapper.find('.event-center');
  const editEvent = wrapper.find('.edit-event');
  const deleteEvent = wrapper.find('.delete-event');
  const openEditModal = jest.spyOn(wrapper.instance(), 'openEditModal');
  const openDeleteModal = jest.spyOn(wrapper.instance(), 'openDeleteModal');

  test('event card details', () => {
    expect(eventName.exists()).toBe(true);
    expect(eventType.exists()).toBe(true);
    expect(eventGuests.exists()).toBe(true);
    expect(eventStart.exists()).toBe(true);
    expect(eventEnd.exists()).toBe(true);
    expect(eventCenter.exists()).toBe(true);
  });

  test('nav to event center', () => {
    eventCenter.simulate('click');
    expect(locations.includes('/centers/1')).toBe(true);
  });

  test('open edit modal', () => {
    editEvent.simulate('click');
    expect(openEditModal).toHaveBeenCalled();
  });

  test('open delete modal', () => {
    deleteEvent.simulate('click');
    expect(openDeleteModal).toHaveBeenCalled();
  });

  test('unmount component', () => {
    wrapper.unmount();
  });
});
