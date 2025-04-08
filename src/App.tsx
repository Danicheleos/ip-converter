import { useState } from 'react';
import { IPRecord } from './services/parser.service';
import { Tab, Tabs } from '@mui/material';
import ReadFile from './components/read-file';
import ParsingData from './components/parsing-data';

const App: React.FC = () => {
  const [data, setData] = useState<IPRecord[]>([]);
  const [dataSecond, setDataSecond] = useState<IPRecord[]>([]);

  const [reset, setReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileNameSecond, setFileNameSecond] = useState<string>('');
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
            <Tab label='Convert IP to IP Range' value={0} disabled={loading} />
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
            <Tab
              label='Select IPs with Deposited Users'
              value={4}
              disabled={loading}
            />
            <Tab label='Select IPs without Dep' value={5} disabled={loading} />
            <Tab
              label='Select overclicked/impressed IP'
              value={6}
              disabled={loading}
            />
          </Tabs>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <div style={{ display: 'flex', width: '100%', flex: 1, justifyContent: 'center' }}>
              <ReadFile
                label='File 1'
                reset={reset}
                onLoadFile={setData}
                onLoading={setLoading}
                loading={loading}
                fileNameChange={setFileName}></ReadFile>
            </div>
            {tab === 5 && (
              <div style={{ display: 'flex', width: '100%', flex: 1,  justifyContent: 'center' }}>
                <ReadFile
                  label='File 2'
                  reset={reset}
                  onLoadFile={setDataSecond}
                  onLoading={setLoading}
                  loading={loading}
                  fileNameChange={setFileNameSecond}></ReadFile>
              </div>
            )}
          </div>

          {data.length > 0 && (
            <>
              {tab === 0 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 1 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 2 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 3 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 4 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 5 && !!data.length && !!dataSecond.length && (
                <ParsingData
                  tab={tab}
                  fileName={fileNameSecond}
                  dataSecond={dataSecond}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
              {tab === 6 && (
                <ParsingData
                  tab={tab}
                  fileName={fileName}
                  data={data}
                  onLoading={setLoading}></ParsingData>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
