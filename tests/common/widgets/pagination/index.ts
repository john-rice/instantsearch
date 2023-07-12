import type { PaginationWidget } from 'instantsearch.js/es/widgets/pagination/pagination';
import type { Act, TestSetup } from '../../common';
import { fakeAct } from '../../common';
import { createOptimisticUiTests } from './optimistic-ui';

type WidgetParams = Parameters<PaginationWidget>[0];
export type PaginationWidgetSetup = TestSetup<{
  widgetParams: Omit<WidgetParams, 'container'>;
}>;

export function createPaginationWidgetTests(
  setup: PaginationWidgetSetup,
  act: Act = fakeAct
) {
  beforeAll(() => {
    document.body.innerHTML = '';
  });

  describe('Pagination widget common tests', () => {
    createOptimisticUiTests(setup, act);
  });
}
