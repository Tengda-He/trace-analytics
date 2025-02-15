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

import React from 'react';
import { EuiIconProps } from '@elastic/eui';

export const LensIconChartBar = ({ title, titleId, ...props }: Omit<EuiIconProps, 'type'>) => (
  <svg
    viewBox="0 0 30 22"
    width={30}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M5 7a1 1 0 011 1v13a1 1 0 01-1 1H1a1 1 0 01-1-1V8a1 1 0 011-1h4zm16-7a1 1 0 011 1v20a1 1 0 01-1 1h-4a1 1 0 01-1-1V1a1 1 0 011-1h4z"
      className="lensChartIcon__subdued"
    />
    <path
      d="M13 11a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1v-9a1 1 0 011-1h4zm16-7a1 1 0 011 1v16a1 1 0 01-1 1h-4a1 1 0 01-1-1V5a1 1 0 011-1h4z"
      className="lensChartIcon__accent"
    />
  </svg>
);
