import { Group, SegmentedControl, Text, Title, Tooltip } from '@mantine/core';
import { IconContrast, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../theme/ThemeProvider';
import { ThemeMode } from '../../theme/theme';

interface HeaderBarProps {
  onReset: () => void;
}

const HeaderBar = ({ onReset }: HeaderBarProps) => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useThemeMode();

  return (
    <Group justify="space-between" align="center">
      <div>
        <Title order={2}>{t('app.title')}</Title>
        <Text size="sm" c="dimmed">
          {t('app.tagline')}
        </Text>
        <Text size="xs" c="blue" onClick={onReset} style={{ cursor: 'pointer' }}>
          {t('app.reset')}
        </Text>
      </div>
      <Group gap="sm" wrap="nowrap">
        <Tooltip label={t('nav.theme')}>
          <SegmentedControl
            data={[
              {
                value: 'light',
                label: (
                  <Group gap="xs" wrap="nowrap">
                    <IconSun size={16} />
                    <Text size="xs" style={{ whiteSpace: 'nowrap' }}>
                      {t('nav.light')}
                    </Text>
                  </Group>
                ),
              },
              {
                value: 'dark',
                label: (
                  <Group gap="xs" wrap="nowrap">
                    <IconMoonStars size={16} />
                    <Text size="xs" style={{ whiteSpace: 'nowrap' }}>
                      {t('nav.dark')}
                    </Text>
                  </Group>
                ),
              },
              {
                value: 'high-contrast',
                label: (
                  <Group gap="xs" wrap="nowrap">
                    <IconContrast size={16} />
                    <Text size="xs" style={{ whiteSpace: 'nowrap' }}>
                      {t('nav.highContrast')}
                    </Text>
                  </Group>
                ),
              },
            ]}
            value={mode}
            onChange={(value) => setMode(value as ThemeMode)}
            size="xs"
          />
        </Tooltip>
        <Tooltip label={t('nav.language')}>
          <SegmentedControl
            data={[
              { label: 'EN', value: 'en' },
              { label: 'DE', value: 'de' },
            ]}
            value={i18n.language.startsWith('de') ? 'de' : 'en'}
            onChange={(value) => i18n.changeLanguage(value)}
            size="xs"
          />
        </Tooltip>
      </Group>
    </Group>
  );
};

export default HeaderBar;
