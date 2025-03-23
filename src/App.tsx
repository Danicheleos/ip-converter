import { useRef, useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ipRangeToCIDR } from './services/ip.service';
import {
  IPRecord,
  saveFile,
  filterWithPairs,
  filterWithUniqUA,
  filterWithMultipleUA,
} from './services/parser.service';
import { Tab, Tabs } from '@mui/material';
import ReadFile from './components/read-file';
import IpToCidr from './components/ip-to-cidr';
import DuplicatedIps from './components/duplicated-ips';
import SingleUA from './components/single-ua';
import MultipleUA from './components/multiple-ua';

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
            fileNameChange={setFileName}></ReadFile>
          {data.length > 0 && !loading && (
            <>
              {tab === 0 && (
                <IpToCidr fileName={fileName} data={data}></IpToCidr>
              )}
              {tab === 1 && (
                <DuplicatedIps fileName={fileName} data={data}></DuplicatedIps>
              )}
              {tab === 2 && (
                <SingleUA fileName={fileName} data={data}></SingleUA>
              )}
              {tab === 3 && (
                <MultipleUA fileName={fileName} data={data}></MultipleUA>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
