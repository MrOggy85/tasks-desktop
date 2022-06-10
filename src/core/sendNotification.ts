const { ipcRenderer } = window.require('electron');

function sendNotification(title: string, body: string) {
  ipcRenderer.sendSync('notify', {
    title,
    body,
  });
}

export default sendNotification;
