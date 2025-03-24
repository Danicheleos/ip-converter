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
              label='Convert IP to IP Range'
              value={0}
              disabled={loading}
            />
            <Tab
              label='Select IPs with pairs by last segment and convert to IP Range'
              value={1}
              disabled={loading}
            />
            <Tab
              label='Select IPs with a single User Agent'
              value={2}
              disabled={loading}
            />
            <Tab
              label='Select IPs with N+ User Agents'
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
                <ParsingData tab={tab} fileName={fileName} data={data} onLoading={setLoading}></ParsingData>
              )}
              {tab === 1 && (
                <ParsingData tab={tab} fileName={fileName} data={data} onLoading={setLoading}></ParsingData>
              )}
              {tab === 2 && (
                <ParsingData tab={tab} fileName={fileName} data={data} onLoading={setLoading}></ParsingData>
              )}
              {tab === 3 && (
                <ParsingData tab={tab} fileName={fileName} data={data} onLoading={setLoading}></ParsingData>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
