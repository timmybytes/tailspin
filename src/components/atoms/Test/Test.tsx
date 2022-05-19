import tw from 'twin.macro'
import React, { FC } from 'react';
import { CustomCssProps } from '@/config';

export type TestProps = CustomCssProps & {
  //
}

/**
 * Test
 */
export const Test: FC<TestProps> = ({
    customCss
  }) => {
  return (
    <Container css={customCss}>
      Hello!
    </Container>
  )
}

const Container = tw.div``
