import { useRef, useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IPRecord } from '../services/parser.service';

const ReadFile: React.FC<{
  reset: boolean;
  onLoadFile: Function;
  onLoading: Function;
  fileNameChange: Function;
  loading: boolean;
}> = ({ reset, onLoadFile, onLoading, fileNameChange, loading }) => {
  const parsedData = useRef<IPRecord[]>([]);
  const progress = useRef<number>(0);
  const totalSize = useRef<number>(0);

  const workerRef = useRef<Worker | null>(null);

  const [fileName, setFileName] = useState<string>('');
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    parsedData.current = [];
    onReset();
    workerRef.current = new Worker(
      new URL('../workers/read-worker.ts', import.meta.url),
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
        onLoadFile(parsedData.current);
        onLoading(false);
        setComplete(true);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [reset]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onLoading(true);
    setComplete(false);
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

        if (suffix.endsWith('\n')) {
          lines.push(suffix);
          suffix = '';
        }
        
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
          fileNameChange(acceptedFiles[0].name);
        });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const onReset = () => {
    onLoading(false);
    setComplete(true);
    parsedData.current = [];
    progress.current = 0;
    totalSize.current = 0;
    onLoadFile([]);
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = '0';
    }
    setFileName('');
    fileNameChange('');
  };
  return (
    <>
      {fileName && (
        <>
          <span className={'fileName'}>{fileName}</span>
          <span className={`${'fileName'} ${'controls'}`}>
              <button
                onClick={onReset}
                className={'controls'}
                disabled={loading}>
                <span>RESET</span>
              </button>
          </span>
        </>
      )}

      {!complete && loading  && (
        <>
          <span style={{ margin: 'auto' }}>Wait a minute...</span>
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
    </>
  );
};

export default ReadFile;
