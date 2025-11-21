import { Alert, Button, Card, Stack, Text, Title } from '@mantine/core';
import { IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { RefObject } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { CalculationResult, Product, SensitivityLever } from '../../core/types';

interface ExportPanelProps {
  result: CalculationResult | null;
  product: Product | null;
  resultRef?: RefObject<HTMLDivElement | null>;
  leverTableRef?: RefObject<HTMLDivElement | null>;
  levers?: SensitivityLever[];
}

const ExportPanel = ({ result, product, resultRef, leverTableRef, levers }: ExportPanelProps) => {
  const { t } = useTranslation();

  if (!result || !product) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('export.noData')}
      </Alert>
    );
  }

  const downloadCsv = () => {
    const componentRows = result.pciByComponent.map((row) => ({
      section: 'component',
      name: row.componentName,
      massKg: row.massKg,
      pci: row.pci,
    }));
    const materialRows = result.pciByMaterial.map((row) => ({
      section: 'material',
      name: row.materialName,
      massKg: row.massKg,
      pci: row.pci,
    }));
    const leverRows = (levers ?? []).map((lever) => ({
      section: 'sensitivity',
      name: lever.label,
      baseline: lever.baselineValue,
      changed: lever.changedValue,
      delta: lever.delta,
    }));

    const csv = Papa.unparse([...componentRows, ...materialRows, ...leverRows]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'procircularitool-results.csv';
    link.click();
  };

  const downloadPdf = async () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    let cursorY = 10;
    pdf.setFontSize(16);
    pdf.text(`ProCirculariTool report – ${product.productName}`, 10, cursorY);
    cursorY += 8;
    pdf.setFontSize(11);
    pdf.text(
      `Overall PCI: ${(result.pciOverall * 100).toFixed(1)}% | Total mass: ${result.totalProductMassKg.toFixed(
        2,
      )} kg`,
      10,
      cursorY,
    );
    cursorY += 10;

    if (resultRef?.current) {
      const canvas = await html2canvas(resultRef.current);
      const img = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(img, 'PNG', 10, cursorY, pageWidth, Math.min(pageHeight, 150));
      cursorY += Math.min(pageHeight, 150) + 6;
    }

    if (leverTableRef?.current) {
      pdf.addPage();
      const canvas = await html2canvas(leverTableRef.current);
      const img = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.text(t('sensitivity.title'), 10, 16);
      pdf.addImage(img, 'PNG', 10, 20, pageWidth, Math.min(pageHeight, 180));
    }

    pdf.save('procircularitool-report.pdf');
  };

  const downloadChartsAsPng = async () => {
    if (!resultRef?.current) return;
    const canvas = await html2canvas(resultRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'procircularitool-charts.png';
    link.click();
  };

  return (
    <Card withBorder shadow="sm">
      <Title order={4} mb="xs">
        {t('export.title')}
      </Title>
      <Text size="sm" c="dimmed" mb="sm">
        {t('export.subtitle')}
      </Text>
      <Stack gap="xs">
        <Button leftSection={<IconDownload size={16} />} onClick={downloadCsv} variant="light">
          {t('export.csv')}
        </Button>
        <Button leftSection={<IconDownload size={16} />} onClick={downloadChartsAsPng} variant="light">
          {t('export.charts')}
        </Button>
        <Button leftSection={<IconDownload size={16} />} onClick={downloadPdf}>
          {t('export.pdf')}
        </Button>
      </Stack>
    </Card>
  );
};

export default ExportPanel;
