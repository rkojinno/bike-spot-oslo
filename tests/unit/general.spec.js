import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'
import Home from '@/views/Home.vue'
import {getHoursAndMinutes} from '@/utils/functions/timeFunctions';
import {getTagTitle,makeIcon} from '@/utils/functions/renderingFunctions'

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })

describe('Load Home SubTitle', () => {
    it('should render subtitle', () => {
      const wrapper = shallowMount(Home)
      expect(wrapper.text()).toMatch(`Check out the status of Oslo's bike stations`)
    })
  })


test('Unix conversion to minutes - 1604634308', () => {
  expect(getHoursAndMinutes(1604634308)).toBe('04:45 CET');
});

test('Get Content from Icon file', () => {
  expect(makeIcon('test_content')).toBe('<p>Jest Test OK</p>');
});

test('Get Tag Title 6', () => {
  expect(getTagTitle(6,'Bike(s)')).toBe('Bike(s) Available');
});

test('Get Tag Title 2', () => {
  expect(getTagTitle(2,'Bike(s)')).toBe('Bike(s) Remaining');
});

test('Get Tag Title 0', () => {
  expect(getTagTitle(0,'Bike(s)')).toBe('No Bike(s) Available');
});



// Objective:  Create a function that, given a list of integers, returns the highest product between three of those numbers. For example, given the list [1, 10, 2, 6, 5, 3] the highest product would be 10 * 6 * 5 = 300

const getHighestProduct = (array) => {
  let sortedArray = array.sort(function(a, b){return b-a});
  let sortedArraySlice = sortedArray.slice(0,3);
  const sumResult = sortedArraySlice.reduce((c,d) => {
    return c * d
  },1);

  return sumResult;
}

test('Test Sorting function  [10,34,100,9,15,8,22] / 74800', () => {
  let array = [10,34,100,9,15,8,22];
  expect(getHighestProduct(array)).toBe(74800);
});

test('Test Sorting function [1, 10, 2, 6, 5, 3] / 300', () => {
  let array = [1, 10, 2, 6, 5, 3];
  expect(getHighestProduct(array)).toBe(300);
});

test('Test Sorting function [7, 1, 1, 1, 1, 1] / 7', () => {
  let array = [7, 1, 1, 1, 1, 1];
  expect(getHighestProduct(array)).toBe(7);
});

test('Test Sorting function [7, 2, 1, 1, 1, 1] / 14', () => {
  let array = [7, 2, 1, 1, 1, 1];
  expect(getHighestProduct(array)).toBe(14);
});