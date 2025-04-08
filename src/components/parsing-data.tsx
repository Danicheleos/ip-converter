import { useEffect, useRef, useState } from 'react';
import { IPRecord, saveFile } from '../services/parser.service';

const ParsingData: React.FC<{
  data: IPRecord[];
  fileName: string;
  tab: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onLoading: Function;
}> = ({ data, fileName, tab, onLoading }) => {
  const [parsedDataResult, setParsedDataResult] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (tab === 0) {
      workerRef.current = new Worker(
        new URL('../workers/ip-to-cidr-worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    if (tab === 1) {
      workerRef.current = new Worker(
        new URL('../workers/duplicated-ips-worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    if (tab === 2) {
      workerRef.current = new Worker(
        new URL('../workers/single-ua-worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }
    if (tab === 3) {
      workerRef.current = new Worker(
        new URL('../workers/multiple-ua-worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }
    if (tab === 4) {
      workerRef.current = new Worker(
        new URL('../workers/deposited.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }
    if (tab === 6) {
      workerRef.current = new Worker(
        new URL('../workers/overclicked.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    if (workerRef.current) {
      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data;
        if (type === 'result') {
          setParsedDataResult(data);
          setLoading(false);
          onLoading(false);
        }
        if (type === 'progress') {
          const progressBar = document.getElementById('progress-bar');
          if (progressBar) {
            progressBar.style.width = data.toString() + '%';
          }
        }
      };
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, [tab]);

  const parseData = () => {
    setLoading(true);
    onLoading(true);

    switch (tab) {
      case 3: {
        workerRef.current?.postMessage({ data, minValue });
        break;
      }
      case 4: {
        workerRef.current?.postMessage({ data, minValue, maxValue: maxValue || 1000000 });
        break;
      }
      case 6: {
        workerRef.current?.postMessage({ data, minValue });
        break;
      }
      default:
        workerRef.current?.postMessage({ data });
    }
  };

  const onExport = (): void => {
    saveFile(fileName, parsedDataResult.join('\n'));
  };

  return (
    <>
      {loading && (
        <>
          <span style={{ margin: 'auto' }}>Wait a minute...</span>
          <div className='progress-bar-wrapper'>
            <div className='progress-bar' id='progress-bar'></div>
          </div>
        </>
      )}

      <div className='result-wrapper'>
        <div className='left-side'>
          <div className='left-side-header'>Input File | {data.length} lines</div>
          <div className='left-side-container'>
            {data.slice(0, 20).map((value, index) => (
              <div key={'l' + index} className='preview'>
                <span className='ip'>{value.IP}</span>
                <span className='ua'>{value.USER_AGENT}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='parse-controls controls'>
          <div>
            {tab === 3 && (
              <div>
                <label>Min UA amount</label>
                <input
                  value={minValue}
                  onChange={(e) => setMinValue(+e.target.value)}
                  type='number'
                  disabled={loading}
                  placeholder='Количество UA'></input>
              </div>
            )}
            {tab === 4 && (
              <>
                <div>
                  <label>Min Deposite</label>
                  <input
                    value={minValue}
                    onChange={(e) => setMinValue(+e.target.value)}
                    min='0'
                    max='1000000'
                    type='number'
                    disabled={loading}
                    placeholder='Min Deposite'></input>
                </div>
                <div>
                  <label>Max Deposite</label>
                  <input
                    value={maxValue}
                    onChange={(e) => setMaxValue(+e.target.value)}
                    type='number'
                    min='0'
                    max='1000000'
                    disabled={loading}
                    placeholder='Max Deposite'></input>
                </div>
              </>
            )}
            {tab === 6 && (
              <div>
                <label>Min Events Amount</label>
                <input
                  value={minValue}
                  onChange={(e) => setMinValue(+e.target.value)}
                  min='0'
                  max='10000'
                  type='number'
                  disabled={loading}
                  placeholder='Min Events Amount'></input>
              </div>
            )}
            <button onClick={parseData} disabled={loading}>
              <span>PARSE</span>
            </button>
          </div>
          {parsedDataResult.length > 0 && (
            <button onClick={onExport} disabled={loading}>
              <span>EXPORT</span>
            </button>
          )}
        </div>

        <div className='right-side'>
          <div className='right-side-header'>Output File | {parsedDataResult.length} lines</div>
          <div className='right-side-container'>
            {parsedDataResult.slice(0, 20).map((value, index) => (
              <div key={'r' + index} className='preview'>
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
    </>
  );
};

export default ParsingData;
