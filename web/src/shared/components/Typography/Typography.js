import styled from 'styled-components';
import { space, width, fontSize, color, textAlign, fontWeight } from 'styled-system';

const Typography = styled.div`
  margin: 0;
  ${space}
  ${color}
  ${textAlign}
  ${fontWeight}
  ${fontSize}
  ${width}
`

Typography.displayName = 'Typography';

Typography.h1 = styled(Typography)`
  line-height: 40px;
`;

Typography.h1.defaultProps = {
  as: 'h1',
  mb: 4,
  fontWeight: 200,
  fontSize: 10
}

Typography.h2 = styled(Typography)`
  line-height: 56px;
  text-transform: uppercase;
`;

Typography.h2.defaultProps = {
  as: 'h2',
  fontWeight: 200,
  fontSize: 9
}

Typography.h3 = styled(Typography)`
  line-height: 24px;
`;

Typography.h3.defaultProps = {
  as: 'h3',
  fontWeight: 500,
  fontSize: 4,
  mb: 3
}

Typography.h4 = styled(Typography)`
  line-height: 40px;
`;

Typography.h4.defaultProps = {
  as: 'h4',
  fontWeight: 500,
  fontSize: 2
}

Typography.h5 = styled(Typography)`
  line-height: 20px;
`;

Typography.h5.defaultProps = {
  as: 'h5',
  fontSize: 1,
  fontWeight: 300,
  mb: 2
}

Typography.p = styled(Typography)`
  line-height: 32px;
`;

Typography.p.defaultProps = {
  as: "p",
  fontWeight: 300,
  fontSize: 3,
  mb: 4
}

Typography.small = styled(Typography)`
  display: inline-block;
  line-height: 16px;
  opacity: .87;
`;

Typography.small.defaultProps = {
  as: 'small',
  fontWeight: 300,
  fontSize: 1
}

export default Typography;