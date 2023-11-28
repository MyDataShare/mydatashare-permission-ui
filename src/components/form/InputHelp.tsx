import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';

interface Props {
  children: ReactNode;
}

const InputHelp = ({ children }: Props) => <StyledHelp>{children}</StyledHelp>;

InputHelp.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputHelp;

/* Styled Components */

const StyledHelp = styled.div`
  color: ${props => props.theme.colors.textSupplementary};
  margin: 0.25em 0 0 0;
`;
