import { Accessor, Show } from 'solid-js';
import './TableRowLoadingSpinner.css';

type Props = {
  show: Accessor<boolean>;
};

export default (props: Props) => (
  <Show when={props.show()}>
    <tr>
      <td colspan="6">
        <div class="flex justify-center">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </td>
    </tr>
  </Show>
);
