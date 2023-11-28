import styled, { css } from 'styled-components/macro';

const Loading = () => {
  return (
    <StyledContainer>
      <StyledFlashingDot className="loading-animation" />
    </StyledContainer>
  );
};

const commonStyles = css`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${p => p.theme.colors.loadingPrimary};
  color: ${p => p.theme.colors.loadingPrimary};
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  margin: 20vh 0;
`;

const StyledFlashingDot = styled.div`
  position: relative;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
  ${commonStyles}

  ::before,
  ::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    ${commonStyles};
  }

  ::before {
    left: -15px;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }

  ::after {
    left: 15px;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: ${p => p.theme.colors.loadingPrimary};
    }
    50%,
    100% {
      background-color: ${p => p.theme.colors.loadingSecondary};
    }
  }
`;

export default Loading;
