import { fakeAct } from '../../common';

import { createOptimisticUiTests } from './optimistic-ui';

import type { TestOptions, TestSetup } from '../../common';
import type { MenuWidget } from 'instantsearch.js/es/widgets/menu/menu';

type WidgetParams = Parameters<MenuWidget>[0];
export type MenuWidgetSetup = TestSetup<{
  widgetParams: Omit<WidgetParams, 'container'>;
}>;

export function createMenuWidgetTests(
  setup: MenuWidgetSetup,
  { act = fakeAct, skippedTests = {} }: TestOptions = {}
) {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Menu widget common tests', () => {
    createOptimisticUiTests(setup, { act, skippedTests });
  });
}
