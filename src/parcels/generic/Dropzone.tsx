import type React from 'react';

export type DroppedData = {
  plainText: string;
  uriList: string;
  html: string;
};

export function Dropzone({
  onEnter,
  onLeave,
  onDrop,
}: {
  onEnter: () => void;
  onLeave: () => void;
  onDrop: (data: DroppedData) => void;
}) {
  function extractData(event: React.DragEvent<HTMLDivElement>) {
    const dataTransfer = event.dataTransfer;
    const plainText = dataTransfer.getData('text/plain');
    const uriList = dataTransfer.getData('text/uri-list');
    const html = dataTransfer.getData('text/html');

    return { plainText, uriList, html } as DroppedData;
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    onEnter();
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    onLeave();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    onDrop(extractData(event));
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
    <div
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
}
