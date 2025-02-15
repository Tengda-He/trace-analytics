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

export const LensIconChartBarHorizontal = ({
  title,
  titleId,
  ...props
}: Omit<EuiIconProps, 'type'>) => (
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
      d="M29 16a1 1 0 011 1v4a1 1 0 01-1 1H1a1 1 0 01-1-1v-4a1 1 0 011-1h28zM22 0a1 1 0 011 1v4a1 1 0 01-1 1H1a1 1 0 01-1-1V1a1 1 0 011-1h21z"
      className="lensChartIcon__subdued"
    />
    <path
      d="M0 9a1 1 0 011-1h15a1 1 0 011 1v4a1 1 0 01-1 1H1a1 1 0 01-1-1V9z"
      className="lensChartIcon__accent"
    />
  </svg>
);
