import React from "react"
import { render } from '@testing-library/react';
import Hero from '../Hero';
describe("Index Header Renders", () => {
  test('Header contains title', () => {
    const { getByText } = render(Hero());
    expect(getByText('Cool Page Dude!')).not.toBeNull();
  });
})