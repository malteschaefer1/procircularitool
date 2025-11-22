import { useRef, useState } from 'react';
import { AppShell, Button, Container, Group, Stepper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ColumnMappingStep from './components/mapping/ColumnMapping';
import ExportPanel from './components/exports/ExportPanel';
import HeaderBar from './components/layout/HeaderBar';
import ParameterPanel from './components/parameters/ParameterPanel';
import ResultsView from './components/results/ResultsView';
import UploadSection from './components/upload/UploadSection';
import WhatIfPanel from './components/whatif/WhatIfPanel';
import { useAppStore } from './store/useAppStore';

const App = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const { calculationResult, reset, product } = useAppStore();
  const resultRef = useRef<HTMLDivElement | null>(null);
  const leverTableRef = useRef<HTMLDivElement | null>(null);

  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 5));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const canProceedFromParameters = Boolean(calculationResult);

  return (
    <AppShell padding="md" header={{ height: 82 }}>
      <AppShell.Header>
        <Container size="xl" py="sm">
          <HeaderBar onReset={() => reset()} />
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl" py="md">
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            allowNextStepsSelect
            orientation="vertical"
            color="teal"
          >
            <Stepper.Step label={t('steps.upload.title')} description={t('steps.upload.desc')}>
              <UploadSection onProceed={nextStep} />
            </Stepper.Step>
            <Stepper.Step label={t('steps.mapping.title')} description={t('steps.mapping.desc')}>
              <ColumnMappingStep onProceed={nextStep} />
              <Group justify="space-between" mt="md">
                <Button variant="light" onClick={prevStep}>
                  {t('actions.back')}
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label={t('steps.parameters.title')} description={t('steps.parameters.desc')}>
              <ParameterPanel onCalculated={nextStep} />
              <Group justify="space-between" mt="md">
                <Button variant="light" onClick={prevStep}>
                  {t('actions.back')}
                </Button>
                <Button onClick={nextStep} disabled={!canProceedFromParameters}>
                  {t('actions.next')}
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label={t('steps.results.title')} description={t('steps.results.desc')}>
              <ResultsView result={calculationResult} containerRef={resultRef} />
              <Group justify="space-between" mt="md">
                <Button variant="light" onClick={prevStep}>
                  {t('actions.back')}
                </Button>
                <Button onClick={nextStep} disabled={!calculationResult} data-testid="results-next">
                  {t('actions.next')}
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label={t('steps.whatif.title')} description={t('steps.whatif.desc')}>
              <WhatIfPanel baselineResult={calculationResult} leverTableRef={leverTableRef} />
              <Group justify="space-between" mt="md">
                <Button variant="light" onClick={prevStep}>
                  {t('actions.back')}
                </Button>
                <Button onClick={nextStep}>
                  {t('actions.next')}
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Completed>
              <ExportPanel
                result={calculationResult}
                product={product}
                resultRef={resultRef}
                leverTableRef={leverTableRef}
              />
              <Group justify="space-between" mt="md">
                <Button variant="light" onClick={prevStep}>
                  {t('actions.back')}
                </Button>
                <Button onClick={() => setActiveStep(0)}>
                  {t('export.restart')}
                </Button>
              </Group>
            </Stepper.Completed>
          </Stepper>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
