import {
  createSignal,
  createResource,
  createEffect,
} from "solid-js";
import { openDownloadFileDialog } from "../../utils/downloadFile";
import { readDB } from "../../utils/restDbSdk";

export interface DbContent<T> {
  isLoading: boolean;
  isReady: boolean;
  result: T;
}

export default  () => {
  const [filenameToDownload, setFilenameToDownload] = createSignal("");
  const [downloadedFile] = createResource(
    filenameToDownload,
    (filename: string) => {
      return filename
        ? readDB(filename).then((json) => ({ filename, json }))
        : Promise.resolve(undefined);
    }
  );

  createEffect(() => {
    const filename = downloadedFile() && downloadedFile()?.filename;
    if (filename) {
      openDownloadFileDialog(filename, downloadedFile()?.json);
    }
    setFilenameToDownload("");
  });

  return {
    downloadFile: setFilenameToDownload,
  };
};
