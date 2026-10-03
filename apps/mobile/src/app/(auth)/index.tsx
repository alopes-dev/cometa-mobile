import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import {
  AuthAction,
  AuthScreen,
  BrandLogo,
  WelcomeVisual,
} from '@/features/auth/components';
import { welcome } from '@/features/auth/content';

/** `Welcome copy` — node 74:24638. */
const Copy = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.auth.metrics.copyGap}px;
`;

const Title = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.auth.type.title.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.title.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.title.lineHeight}px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`;

const Description = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.auth.type.body.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.body.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.body.lineHeight}px;
  color: ${({ theme }) => theme.auth.color.textSecondary};
`;

/** `Legal` — node 74:24646. */
const Legal = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.auth.type.legal.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.legal.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.legal.lineHeight}px;
  color: ${({ theme }) => theme.auth.color.textMuted};
`;

/**
 * Welcome — node 74:24614.
 *
 * Both actions lead to the same screen. The board draws them as two, and that
 * is the point: a returning customer should not have to decide whether they
 * are "signing up" before they have typed anything. The number itself decides,
 * on the screen after the code — which is why there is no separate sign-up
 * path to route to here.
 */
export default function Welcome() {
  const router = useRouter();
  const openPhone = () => router.push('/(auth)/phone');

  return (
    <AuthScreen
      footer={
        <>
          <AuthAction label={welcome.primaryAction} onPress={openPhone} />
          <AuthAction label={welcome.secondaryAction} variant="secondary" onPress={openPhone} />
          <Legal>{welcome.legal}</Legal>
        </>
      }
    >
      <BrandLogo />
      <WelcomeVisual />
      <Copy>
        <Title accessibilityRole="header">{welcome.title}</Title>
        <Description>{welcome.description}</Description>
      </Copy>
    </AuthScreen>
  );
}
