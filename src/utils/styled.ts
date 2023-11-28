import { css } from 'styled-components/macro';

import { CONTENT_MAX_WIDTH_PX } from './constants';

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexSpaceBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexStart = css`
  display: flex;
  align-items: flex-start;
`;

export const contentMaxWidth = css`
  display: flex;
  position: relative;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH_PX};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme: { em, spacing } }) => em(spacing.medium)};
  padding-right: ${({ theme: { em, spacing } }) => em(spacing.medium)};
  @media only screen and (max-width: 690px) {
    padding-left: ${({ theme: { em, spacing } }) => em(spacing.small)};
    padding-right: ${({ theme: { em, spacing } }) => em(spacing.small)};
  }
`;
