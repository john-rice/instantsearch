import type { RefinementListWidget } from 'instantsearch.js/es/widgets/refinement-list/refinement-list';
import type { TestSetup, Act } from '../../common';
import { fakeAct } from '../../common';
import { createOptimisticUiTests } from './optimistic-ui';

type WidgetParams = Parameters<RefinementListWidget>[0];
export type RefinementListWidgetSetup = TestSetup<{
  widgetParams: Omit<WidgetParams, 'container'>;
}>;

export function createRefinementListWidgetTests(
  setup: RefinementListWidgetSetup,
  act: Act = fakeAct
) {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('RefinementList widget common tests', () => {
    createOptimisticUiTests(setup, act);
  });
}
