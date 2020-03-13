self.languagePluginUrl = 'pyodide/';
importScripts('pyodide/pyodide.js');

function parseLog(log) {
  return log
    .split(/\r?\n/)
    .slice(-4)
    .join('\n');
}

var onmessage = function(e) {
  const action = e.data.action;
  if (action === 'init' && e.data.packages) {
    languagePluginLoader.then(() => {
      self.pyodide
        .loadPackage(e.data.packages)
        .then(() => {
          self.postMessage({
            action: 'loaded',
            packages: Object.keys(self.pyodide.loadedPackages)
          });
        })
        .catch(err => {
          self.postMessage({
            action: 'error',
            results: err.message
          });
        });
    });
  } else if (action === 'exec' && e.data.code) {
    try {
      self.pyodide
        .runPythonAsync(e.data.code)
        .then(results => {
          self.postMessage({ action: 'return', results: results });
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
