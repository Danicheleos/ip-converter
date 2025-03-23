import { useState } from 'react';
import {
  IPRecord,
} from './services/parser.service';
import { Tab, Tabs } from '@mui/material';
import ReadFile from './components/read-file';
import ParsingData from './components/parsing-data';

const App: React.FC = () => {
  const [data, setData] = useState<IPRecord[]>([]);

  const [reset, setReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [tab, setTab] = useState<number>(0);

  const onReset = () => {
    setData([]);
    setReset(!reset);
  };

  const changeTab = (_, newValue): void => {
    setTab(newValue);
    onReset();
  };

  return (
    <>
      <div className={`page variable `}>
        <main className={'main'}>
          <Tabs value={tab} onChange={changeTab} centered variant='fullWidth'>
            <Tab
              label='Конвертировать IP в IP Range'
              value={0}
              disabled={loading}
            />
            <Tab
              label='Сделать выборку по 2 и более адресов в последнем разряде'
              value={1}
              disabled={loading}
            />
            <Tab
              label='Выбрать IP только с 1 UA на IP'
              value={2}
              disabled={loading}
            />
            <Tab
              label='Выбрать IP с несколькими UA на IP'
              value={3}
              disabled={loading}
            />
          </Tabs>

          <ReadFile
            reset={reset}
            onLoadFile={setData}
            onLoading={setLoading}
            loading={loading}
            fileNameChange={setFileName}></ReadFile>
          {data.length > 0 && (
            <>
              {tab === 0 && (
                <ParsingData fileName={fileName} data={data} scriptPath='../workers/ip-to-cidr-worker.ts' onLoading={setLoading}></ParsingData>
              )}
              {tab === 1 && (
                <ParsingData fileName={fileName} data={data} scriptPath='../workers/duplicated-ips-worker.ts' onLoading={setLoading}></ParsingData>
              )}
              {tab === 2 && (
                <ParsingData fileName={fileName} data={data} scriptPath='../workers/single-ua-worker.ts' onLoading={setLoading}></ParsingData>
              )}
              {tab === 3 && (
                <ParsingData fileName={fileName} data={data} scriptPath='../workers/multiple-ua-worker.ts' countUA={true} onLoading={setLoading}></ParsingData>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
