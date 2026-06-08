import { Button, Center, Group, Menu, Modal, Stack, Textarea, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBug, IconMessageReportFilled } from '@tabler/icons-react';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import styles from '@/parcels/details/TcgPrintDetails/QuickActionButtons/QuickActionButtons.module.css';
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

  return (
    <>
      <Modal opened={reportModalOpened} onClose={closeReportModal} title="Report Page" closeOnClickOutside={false}>
        <Stack>
          <GourmetSelect
            label={'Subject'}
            data={subjectByTypes.print.map((s) => {
              return { label: capitalizeFirstLetter(s), value: s };
            })}
            value={newReport.subject}
            onChange={(option) => {
              setNewReport({ ...newReport, subject: option ?? undefined });
            }}
          />
          <GourmetSelect
            label={'Severity'}
            data={['unknown', 'minor', 'medium', 'major'].map((s) => {
              return { label: capitalizeFirstLetter(s), value: s };
            })}
            value={newReport.severity}
            onChange={(option) => {
              setNewReport({ ...newReport, severity: option as DataIssueReport['severity'] });
            }}
          />

          <Textarea
            label={'Note'}
            placeholder={'Describe the issue in more detail...'}
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
                Cancel
              </GourmetText>
            </Button>
            <Button
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
                    return;
                  }
                  closeReportModal();
                });
              }}
            >
              <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
                Send report
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
            <Center>
              <IconBug size={22} color={'var(--gourmet-neutral-8)'} />
            </Center>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown style={{ backgroundColor: 'var(--gourmet-neutral-1)', borderColor: 'var(--gourmet-neutral-3)' }}>
          {(openPublicReports?.length ?? 0) > 0 && (
            <>
              <GourmetText style={{ wordBreak: 'break-all' }}>{JSON.stringify(openPublicReports)}</GourmetText>

              <Menu.Divider />
            </>
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
