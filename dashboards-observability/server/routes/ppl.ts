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

import { 
  IRouter,
  IOpenSearchDashboardsResponse,
  ResponseError,
 } from '../../../../src/core/server';
import { schema } from '@osd/config-schema';
import PPLFacet from '../services/facets/ppl_facet';
import {
  PPL_BASE,
  PPL_SEARCH
} from '../../common/constants/shared';

export function registerPplRoute({
  router,
  facet,
}: {
  router: IRouter
  facet: PPLFacet
}) {
  router.post({
    path: `${PPL_BASE}${PPL_SEARCH}`,
    validate: { 
      body: schema.object({
        query: schema.string(),
        format: schema.string()
    })}
  }, 
  async (
    context,
    req,
    res
  ) : Promise<IOpenSearchDashboardsResponse<any | ResponseError>> => {
    const queryRes: any = await facet.describeQuery(req);
    if (queryRes['success']) {
      const result: any = {
        body: {
          ...queryRes['data']
        }
      };
      return res.ok(result);
    }
    return res.custom({
      statusCode: queryRes.data.statusCode || queryRes.data.status || 500,
      body: queryRes.data.body || queryRes.data.message || '',
    });
  });
}
