import { useRef, useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ipRangeToCIDR,
  groupIPsToCIDR,
  ipToBigInt,
} from './services/ip.service';
import {
  IPRecord,
  saveFile,
  filterWithPairs,
  filterWithUniqUA,
  filterWithMultipleUA,
} from './services/parser.service';
import { Tab, Tabs } from '@mui/material';

const App: React.FC = () => {
  const parsedData = useRef<IPRecord[]>([]);
  const progress = useRef<number>(0);
  const totalSize = useRef<number>(0);
  const parsingProgress = useRef<number>(0);

  const workerRef = useRef<Worker | null>(null);
  const progressWorkerRef = useRef<Worker | null>(null);

  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [maxUA, setMaxUA] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const [parsedDataResult, setParsedDataResult] = useState<string[]>([]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./read-worker.ts', import.meta.url),
      { type: 'module' }
    );
    progressWorkerRef.current = new Worker(
      new URL('./progress-worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current.onmessage = (e) => {
      progress.current = e.data.size + progress.current;
      parsedData.current = [...parsedData.current, ...e.data.data];

      const percentage = Math.round(
        (progress.current / totalSize.current) * 100
      );
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = percentage.toString() + '%';
      }
      if (percentage === 100) {
        setLoading(false);
      }
    };

    progressWorkerRef.current.onmessage = (e) => {
      parsingProgress.current = e.data;
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = parsingProgress.current.toString() + '%';
      }
    };

    return () => {
      workerRef.current?.terminate();
      progressWorkerRef.current?.terminate();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoading(true);
    totalSize.current = acceptedFiles[0].size;

    let firstLine = true;
    let separator = ',';
    let headers: string[] = [];
    let suffix = '';

    const dest = new WritableStream({
      write(str) {
        const lines = (suffix + str).split('\n');

        if (firstLine) {
          for (const char of lines[0]) {
            if (char === separator) {
              break;
            }
            if (char === ';') {
              separator = ';';
              break;
            }
          }
          headers = lines[0].split(separator);
          firstLine = false;
        }
        suffix = lines.pop() || '';

        if (workerRef.current) {
          workerRef.current.postMessage({
            lines,
            headers,
            separator,
            size: new Blob([str]).size,
          });
        }
      },
    });
    const blob = new Response(acceptedFiles[0]);

    if (blob.body) {
      blob.body
        .pipeThrough(new TextDecoderStream(), {})
        .pipeTo(dest)
        .then(() => {
          setFileName(acceptedFiles[0].name);
        });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const onGetCIDR = () => {
    setParsedDataResult(
      Array.from<string>(
        new Set<string>(
          parsedData.current.map((record) => {
            return ipRangeToCIDR(record.IP, record.IP);
          })
        )
      )
    );
  };

  const onGetCIDRWithPairs = () => {
    const result = filterWithPairs(parsedData.current);
    setParsedDataResult(result);
  };

  const onGetIpsWithUniqUA = () => {
    const result = filterWithUniqUA(parsedData.current);
    setParsedDataResult(result);
  };

  const onGetIpsWithMultipleUA = () => {
    const result = filterWithMultipleUA(parsedData.current, maxUA);
    setParsedDataResult(result);
  };
  const onReset = () => {
    parsedData.current = [];
    progress.current = 0;
    totalSize.current = 0;
    setParsedDataResult([]);
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = '0';
    }
    setFileName('');
  };

  const changeTab = (_, newValue): void => {
    setTab(newValue);
    onReset();
  };

  const onExport = (): void => {
    saveFile(fileName, parsedDataResult.join('\n'));
  };

  const onParse = (): void => {
    switch (tab) {
      case 0: {
        onGetCIDR();
        break;
      }
      case 1: {
        onGetCIDRWithPairs();
        break;
      }
      case 2: {
        onGetIpsWithUniqUA();
        break;
      }
      case 3: {
        onGetIpsWithMultipleUA();
        break;
      }
    }
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

          {fileName && (
            <>
              <span className={'fileName'}>{fileName}</span>
              <span className={`${'fileName'} ${'controls'}`}>
                {!loading && (
                  <button onClick={onReset} className={'controls'}>
                    <span>RESET</span>
                  </button>
                )}
              </span>
            </>
          )}

          {loading && (
            <>
              <span style={{margin: 'auto'}}>
                Wait a minute...
              </span>
              <div className='progress-bar-wrapper'>
                <div className='progress-bar' id='progress-bar'></div>
              </div>
            </>
          )}
          {!loading && parsedData.current.length === 0 && (
            <div
              className={`${'dropzone'} ${isDragActive ? 'over' : ''}`}
              {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some file here, or click to select file</p>
              )}
            </div>
          )}

          {parsedData.current.length > 0 && !loading && (
            <div className='result-wrapper'>
              <div className='left-side'>
                <div className='left-side-header'>Загружаемный Файл</div>
                <div className='left-side-container'>
                {parsedData.current.slice(0, 20).map((value) => (
                  <div className='preview'>
                    <span className='ip'>{value.IP}</span>
                    <span className='ua'>{value.USER_AGENT}</span>
                  </div>
                ))}
                </div>
              </div>
              <div className='parse-controls controls'>
                <div>
                  {tab === 3 && (
                    <div className='input-container'>
                      <label>Количество UA</label>
                      <input
                        value={maxUA}
                        onChange={(e) => setMaxUA(+e.target.value)}
                        type='number'
                        placeholder='Количество UA'></input>
                    </div>
                  )}
                  <button
                    onClick={onParse}
                    disabled={tab === 3 && (!maxUA || maxUA <= 0)}>
                    <span>PARSE</span>
                  </button>
                </div>
                {parsedDataResult.length > 0 && (
                  <button onClick={onExport}>
                    <span>EXPORT</span>
                  </button>
                )}
              </div>

              <div className='right-side'>
                <div className='right-side-header'>Исходящий Файл</div>
                <div className='right-side-container'>
                  {parsedDataResult.slice(0, 20).map((value) => (
                    <div className='preview'>
                      <span className='ip'>{value}</span>
                    </div>
                  ))}

                  {parsedDataResult.length === 0 && (
                    <div className='preview'>
                      <span className='ip'>Пусто</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            // <div className={'controls'}>
            //   <button onClick={onGetCIDR}>
            //     <span>Get CIDR</span>
            //   </button>
            //   <button onClick={onGetCIDRWithPairs}>
            //     <span>Get CIDR by pairs</span>
            //   </button>
            //   <button onClick={onGetIpsWithUniqUA}>
            //     <span>Get IPs with uniq UA</span>
            //   </button>
            //   <div className='input-wrapper'>
            //
            //     <button onClick={onGetIpsWithMultipleUA}>
            //       <span>Get IPs with multiple UA</span>
            //     </button>
            //   </div>
            // </div>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
