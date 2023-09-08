import { Accessor } from 'solid-js';

export default ({
  name,
  exportedAt,
  downloadFile,
}: {
  name: string;
  exportedAt: Accessor<string>;
  downloadFile: (fileName: string) => void;
}) => {
  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm">{name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">{exportedAt()}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          class="text-textColor-success hover:underline"
          onclick={() => downloadFile(name)}
        >
          Download
        </button>
      </td>
    </tr>
  );
};
