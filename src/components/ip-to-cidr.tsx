import { useState } from 'react';
import { IPRecord, saveFile } from '../services/parser.service';
import { ipRangeToCIDR } from '../services/ip.service';

const IpToCidr: React.FC<{ data: IPRecord[], fileName: string }> = ({ data, fileName }) => {
  const [parsedDataResult, setParsedDataResult] = useState<string[]>([]);


  const onGetCIDR = () => {
    setParsedDataResult(
      Array.from<string>(
        new Set<string>(
          data.map((record) => {
            return ipRangeToCIDR(record.IP, record.IP);
          })
        )
      )
    );
  };

    const onExport = (): void => {
      saveFile(fileName, parsedDataResult.join('\n'));
    };

  return (
    <>
      <div className='result-wrapper'>
        <div className='left-side'>
          <div className='left-side-header'>Загружаемный Файл</div>
          <div className='left-side-container'>
            {data.slice(0, 20).map((value) => (
              <div className='preview'>
                <span className='ip'>{value.IP}</span>
                <span className='ua'>{value.USER_AGENT}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='parse-controls controls'>
          <div>
            <button
              onClick={onGetCIDR}>
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
    </>
  );
};

export default IpToCidr;
