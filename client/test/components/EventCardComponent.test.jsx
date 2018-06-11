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

  it('should display event details', () => {
    expect(eventName.text()).toBe(event.name);
    expect(eventType.text()).toBe(event.type);
    expect(eventGuests.text()).toBe(event.guests);
    expect(eventStart.text()).toBe(event.start);
    expect(eventEnd.text()).toBe(event.end);
    expect(eventCenter.text()).toBe(event.center.name);
  });

  it('should add centers/1 path to locations array', () => {
    eventCenter.simulate('click');
    expect(locations.includes('/centers/1')).toBe(true);
  });

  it('should open event edit modal', () => {
    editEvent.simulate('click');
    expect(openEditModal).toHaveBeenCalled();
  });

  it('should open event delete modal', () => {
    deleteEvent.simulate('click');
    expect(openDeleteModal).toHaveBeenCalled();
  });
});
