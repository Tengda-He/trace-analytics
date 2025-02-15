/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useContext } from 'react';
import { mount } from 'enzyme';
import { RootDragDropProvider, DragContext } from './providers';

jest.useFakeTimers();

describe('RootDragDropProvider', () => {
  test('reuses contexts for each render', () => {
    const contexts: Array<{}> = [];
    const TestComponent = ({ name }: { name: string }) => {
      const context = useContext(DragContext);
      contexts.push(context);
      return (
        <div data-test-subj="test-component">
          {name} {!!context.dragging}
        </div>
      );
    };

    const RootComponent = ({ name }: { name: string }) => (
      <RootDragDropProvider>
        <TestComponent name={name} />
      </RootDragDropProvider>
    );

    const component = mount(<RootComponent name="aaaa" />);

    component.setProps({ name: 'bbbb' });

    expect(component.find('[data-test-subj="test-component"]').text()).toContain('bbb');
    expect(contexts.length).toEqual(2);
    expect(contexts[0]).toStrictEqual(contexts[1]);
  });
});
