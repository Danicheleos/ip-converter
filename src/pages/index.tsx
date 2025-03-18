import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import styles from '@/styles/Home.module.scss';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  filterWithMultipleUA,
  filterWithPairs,
  filterWithUniqUA,
  IPRecord,
  parseCSV,
  saveFile,
} from '../services/parser.service';
import { groupIPsToCIDR, ipRangeToCIDR } from '../services/ip.service';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const parsedData = useRef<IPRecord[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [maxUA, setMaxUA] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoading(true);
    acceptedFiles[0].text().then((data) => {
      parsedData.current = parseCSV(data);
      setFileName(acceptedFiles[0].name);
      setLoading(false);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const onGetCIDR = () => {
    console.log(parsedData.current);
    saveFile(
      fileName,
      Array.from(
        new Set(
          parsedData.current.map((record) =>
            ipRangeToCIDR(record.IP, record.IP)
          )
        )
      ).join('\n')
    );
  };

  const onGetCIDRWithPairs = () => {
    const filteredPairs = filterWithPairs(parsedData.current);
    const result = groupIPsToCIDR(filteredPairs);
    saveFile(fileName, result.join('\n'));
  };

  const onGetIpsWithUniqUA = () => {
    const ipsWithUniqUA = filterWithUniqUA(parsedData.current);
    saveFile(fileName, ipsWithUniqUA.join('\n'));
  };

  const onGetIpsWithMultipleUA = () => {
    const ipsWithMultipleUA = filterWithMultipleUA(parsedData.current, maxUA);
    saveFile(fileName, ipsWithMultipleUA.join('\n'));
  };

  const onReset = () => {
    parsedData.current = [];
    setFileName('');
  };

  return (
    <>
      <Head>
        <title>IP Converter</title>
        <meta name='description' content='IP Converter' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          {fileName && (
            <>
              <span className={styles.fileName}>{fileName}</span>
              <span className={`${styles.fileName} ${styles.controls}`}>
                <button onClick={onReset} className={styles.controls}>
                  <span>RESET</span>
                </button>
              </span>
            </>
          )}

          {loading && 
          <>
          Wait a minute...
          </>
          }

          {!loading && parsedData.current.length === 0 && (
            <div
              className={`${styles.dropzone} ${
                isDragActive ? styles.over : ''
              }`}
              {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some file here, or click to select file</p>
              )}
            </div>
          )}

          {parsedData.current.length > 0 && (
            <div className={styles.controls}>
              <button onClick={onGetCIDR}>
                <span>Get CIDR</span>
              </button>
              <button onClick={onGetCIDRWithPairs}>
                <span>Get CIDR by pairs</span>
              </button>
              <button onClick={onGetIpsWithUniqUA}>
                <span>Get IPs with uniq UA</span>
              </button>
              <div className='input-wrapper'>
                <input
                  value={maxUA}
                  onChange={(e) => setMaxUA(+e.target.value)}
                  type='number'
                  placeholder='min UA value'></input>
                <button onClick={onGetIpsWithMultipleUA}>
                  <span>Get IPs with multiple UA</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
