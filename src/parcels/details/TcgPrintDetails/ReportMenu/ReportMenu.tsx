import { Button, Center, Flex, Group, Indicator, Menu, Modal, Stack, Textarea, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconBug, IconMessageReportFilled } from '@tabler/icons-react';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { GourmetSelect } from '@/parcels/generic/mantine/GourmetSelect/GourmetSelect.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import {
  type CreateUserReportRequest,
  createUserReport,
  type DataIssueReport,
  getOpenReports,
  type PublicDataIssueReport,
} from '@/parcels/reports/api.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ReportMenu.module.css';

const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);

const subjectByTypes: Record<DataIssueReport['subjectType'], string[]> = {
  print: ['name', 'text', 'image', 'mechanic', 'legality', 'ruling', 'related', 'other'],
  search: [],
  set: [],
  card: [],
};

export function ReportMenu() {
  const { t } = useTranslation('details', { keyPrefix: 'report' });
  const { user } = useAuth();

  const location = useLocation();
  const tcg = useTcgByLocation() as Tcg;
  const [opened, setOpened] = useState(false);

  const { print: card } = routeApi.useLoaderData();

  const [openPublicReports, setOpenPublicReports] = useState<PublicDataIssueReport[] | undefined>(undefined);
  useEffect(() => {
    getOpenReports(tcg, 'print', card.print.id).then((data) => {
      setOpenPublicReports(data.data?.items ?? []);
    });
  }, [card.print.id, tcg]);

  const [newReport, setNewReport] = useState<CreateUserReportRequest>({});
  const [reportModalOpened, { open: openReportModal, close: closeReportModal }] = useDisclosure(false);

  function onReportSentSuccess() {
    notifications.show({
      autoClose: 5_000,
      color: 'var(--gourmet-green-1)',
      message: (
        <Group wrap={'nowrap'} align={'stretch'}>
          <Stack justify={'start'} gap={'0.25rem'}>
            <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
              {t('reportSent.title')}
            </GourmetText>
            <GourmetText fz={'0.9rem'}>{t('reportSent.description')}</GourmetText>
          </Stack>
        </Group>
      ),
    });
  }

  return (
    <>
      <Modal opened={reportModalOpened} onClose={closeReportModal} title={t('title')} closeOnClickOutside={false}>
        <Stack>
          <GourmetSelect
            label={t('form.subject')}
            data={subjectByTypes.print.map((s) => {
              return { label: capitalizeFirstLetter(s), value: s };
            })}
            value={newReport.subject}
            onChange={(option) => {
              setNewReport({ ...newReport, subject: option ?? undefined });
            }}
          />
          <GourmetSelect
            label={t('form.severity.title')}
            data={['unknown', 'minor', 'medium', 'major'].map((s) => {
              return { label: t(`form.severity.${s}`), value: s };
            })}
            value={newReport.severity}
            onChange={(option) => {
              setNewReport({ ...newReport, severity: option as DataIssueReport['severity'] });
            }}
          />

          <Textarea
            required
            label={t('form.note.title')}
            placeholder={t('form.note.placeholder')}
            value={newReport.note}
            autosize
            minRows={4}
            maxRows={4}
            onChange={(event) => {
              setNewReport({ ...newReport, note: event.currentTarget.value ?? undefined });
            }}
          />

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-7)'} onClick={closeReportModal}>
              <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'}>
                {t('form.cancel')}
              </GourmetText>
            </Button>
            <Button
              disabled={(newReport.note?.length ?? 0) === 0}
              color={'var(--gourmet-blue-1)'}
              onClick={() => {
                if (user?.state !== 'verified') return;

                createUserReport(
                  user.id,
                  tcg,
                  'print',
                  card.print.id,
                  `https://cardgourmet.com${location.href}`,
                  newReport,
                ).then((data) => {
                  if (data.error) {
                    sendErrorNotification(data.error);
                    return;
                  }
                  closeReportModal();
                  onReportSentSuccess();
                });
              }}
            >
              <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
                {t('form.sendReport')}
              </GourmetText>
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Menu
        opened={opened}
        onChange={setOpened}
        openDelay={0}
        transitionProps={{ transition: 'pop', duration: 100 }}
        position={'bottom-end'}
        shadow="md"
        width={250}
      >
        <Menu.Target>
          <UnstyledButton className={styles.quickActionButton}>
            <Indicator color="var(--gourmet-orange-1)" size={8} disabled={(openPublicReports?.length ?? 0) === 0}>
              <Center>
                <IconBug size={22} color={'var(--gourmet-neutral-8)'} />
              </Center>
            </Indicator>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown style={{ backgroundColor: 'var(--gourmet-neutral-1)', borderColor: 'var(--gourmet-neutral-3)' }}>
          {(openPublicReports?.length ?? 0) > 0 && (
            <Flex p={'0.25rem'}>
              <GourmetText cgmff={'ui'} c={'var(--gourmet-orange-1)'}>
                {t('knownIssues', { count: openPublicReports?.length })}
              </GourmetText>
            </Flex>
          )}

          <Menu.Item
            leftSection={<IconMessageReportFilled size={18} />}
            className={styles.menuItem}
            onClick={() => {
              setNewReport({
                subject: 'other',
                severity: 'unknown',
              });

              openReportModal();
            }}
          >
            <GourmetText cgmff={'ui'}>{t('options.createReport')}</GourmetText>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
