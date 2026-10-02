import { useState } from 'react';
import {
  ActionStack,
  CategoryCard,
  Grid,
  OnboardingAction,
  Spacer,
  StepHeader,
  StepScreen,
  categories,
  preferences as copy,
  setupStep,
} from '@/features/onboarding';
import { useSetup } from '@/hooks/useSetup';

/**
 * Step 4 of 4 — "O que gostas de pedir?", node 44:22517.
 *
 * The last step, so both actions end the setup. "Continuar" keeps the selection
 * and "Pular" does not; neither is a dead end, which is the board's rule that
 * personalization is optional.
 */
export default function PreferencesStep() {
  const { saveCategories, completeSetup } = useSetup();
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [finishing, setFinishing] = useState(false);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );

  const handleContinue = async () => {
    setFinishing(true);
    await saveCategories(selected);
    await completeSetup();
  };

  const handleSkip = async () => {
    setFinishing(true);
    await completeSetup();
  };

  return (
    <StepScreen step={setupStep.preferences}>
      <StepHeader title={copy.title} description={copy.description} />
      <Grid>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            selected={selected.includes(category.id)}
            onToggle={toggle}
          />
        ))}
      </Grid>
      <Spacer />
      <ActionStack>
        <OnboardingAction label={copy.submit} loading={finishing} onPress={handleContinue} />
        <OnboardingAction
          label={copy.skip}
          tone="tertiary"
          disabled={finishing}
          onPress={handleSkip}
        />
      </ActionStack>
    </StepScreen>
  );
}
