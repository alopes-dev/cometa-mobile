import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ActionStack,
  AddressField,
  OnboardingAction,
  Row,
  RowItem,
  Spacer,
  StepHeader,
  StepScreen,
  address as copy,
  emptyAddress,
  setupStep,
  type DeliveryAddress,
} from '@/features/onboarding';
import { useSetup } from '@/hooks/useSetup';

/**
 * Step 2 of 4 — "Adicionar endereço", node 44:22436.
 *
 * The draft is held locally and written once on save, so a half-typed address
 * never reaches storage and every keystroke stays off the provider.
 *
 * Only the street is required to save. The board labels the complement
 * "(opcional)" and leaves the rest free-form, and its own rule is "poucos
 * campos, linguagem local e referência livre" — gating the button on a fully
 * populated form would contradict that.
 */
export default function AddressStep() {
  const router = useRouter();
  const { saveAddress } = useSetup();
  const [draft, setDraft] = useState<DeliveryAddress>(emptyAddress);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof DeliveryAddress) => (value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await saveAddress(draft);
    setSaving(false);
    router.push('/(setup)/notifications');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepScreen step={setupStep.address}>
        <ScrollView
          // `flex: 1` so the scroller claims the height left under the progress
          // bar; `flexGrow` on the content keeps the spacer able to push the
          // save button to the bottom on screens taller than the form.
          style={{ flex: 1, alignSelf: 'stretch' }}
          contentContainerStyle={{ gap: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StepHeader
            title={copy.title}
            description={copy.description}
            onBack={() => router.back()}
          />

          <AddressField
            label={copy.fields.street.label}
            placeholder={copy.fields.street.placeholder}
            value={draft.street}
            onChangeText={set('street')}
            autoCapitalize="words"
          />

          <Row>
            <RowItem>
              <AddressField
                label={copy.fields.number.label}
                placeholder={copy.fields.number.placeholder}
                value={draft.number}
                onChangeText={set('number')}
                keyboardType="number-pad"
              />
            </RowItem>
            <RowItem>
              <AddressField
                label={copy.fields.district.label}
                placeholder={copy.fields.district.placeholder}
                value={draft.district}
                onChangeText={set('district')}
                autoCapitalize="words"
              />
            </RowItem>
          </Row>

          <AddressField
            label={copy.fields.city.label}
            placeholder={copy.fields.city.placeholder}
            value={draft.city}
            onChangeText={set('city')}
            autoCapitalize="words"
          />
          <AddressField
            label={copy.fields.complement.label}
            placeholder={copy.fields.complement.placeholder}
            value={draft.complement}
            onChangeText={set('complement')}
          />
          <AddressField
            label={copy.fields.reference.label}
            placeholder={copy.fields.reference.placeholder}
            value={draft.reference}
            onChangeText={set('reference')}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <Spacer />

          <ActionStack>
            <OnboardingAction
              label={copy.save}
              loading={saving}
              disabled={draft.street.trim().length === 0}
              onPress={handleSave}
            />
          </ActionStack>
        </ScrollView>
      </StepScreen>
    </KeyboardAvoidingView>
  );
}
