interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  {
    name: 'web-rtc-adapter',
    src: 'https://webrtc.github.io/adapter/adapter-latest.js',
  },
  {
    name: 'web-rtc-server',
    src: './server.js',
  },
];
