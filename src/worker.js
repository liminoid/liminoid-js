export default String.raw`
self.languagePluginUrl = 'https://cdn.liminoid.io/pyodide/0.14.3/';
importScripts('https://cdn.liminoid.io/pyodide/0.14.3/pyodide.js');

function parseLog(log) {
  return log
    .split(/\r?\n/)
    .slice(-4)
    .join('\n');
}

self.onmessage = function(e) {
  const { action } = e.data;
  if (action === 'init') {
    languagePluginLoader
      .then(() => {
        self.postMessage({
          action: 'initialized'
        });
      })
      .catch(err => {
        self.postMessage({
          action: 'error',
          results: err.message
        });
      });
  } else if (action === 'load' && e.data.packages) {
    self.pyodide
      .loadPackage(e.data.packages)
      .then(() => {
        self.postMessage({
          action: 'loaded'
        });
      })
      .catch(err => {
        self.postMessage({
          action: 'error',
          results: err.message
        });
      });
  } else if (action === 'exec' && e.data.code) {
    try {
      self.pyodide
        .runPythonAsync(e.data.code)
        .then(results => {
          self.postMessage({ action: 'return', results });
        })
        .catch(err => {
          self.postMessage({
            action: 'error',
            results: err.message
              .split(/\r?\n/)
              .slice(-2)
              .join('\n')
          });
        });
    } catch (err) {
      self.postMessage({
        action: 'error',
        results: parseLog(err.message)
      });
    }
  }
};
`;
