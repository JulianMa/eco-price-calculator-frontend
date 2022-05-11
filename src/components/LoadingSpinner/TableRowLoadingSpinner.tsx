import { Resource, Show } from 'solid-js';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  resource: Resource<any>;
};

export default (props: Props) => (
  <Show when={!props.resource()}>
    <tr>
      <td colspan="6">
        <div class="flex justify-center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </td>
    </tr>
  </Show>
);
