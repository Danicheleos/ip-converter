import { parseCSV } from '../services/parser.service';

addEventListener('message' ,(e) => {
  const { lines, headers, separator, size } = e.data;
  postMessage({ data: parseCSV(lines, headers, separator), size});
});

