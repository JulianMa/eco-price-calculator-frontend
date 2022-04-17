import { Accessor } from "solid-js";

export default ({name, exportedAt, downloadFile}: {name: string, exportedAt: Accessor<string>, downloadFile: (fileName: string) => void}) => {
  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {name}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {exportedAt()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          class="text-indigo-800 hover:text-indigo-900"
          onclick={() => downloadFile(name)}
        >
          Download
        </button>
      </td>
    </tr>
  );
};
