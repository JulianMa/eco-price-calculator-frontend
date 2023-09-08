import classNames from 'classnames';
import { For } from 'solid-js';
type Props = {
  options: { value: string | number; text: string }[];
  onChange: (selected: string | number) => void;
  selected: string | number;
};
export default (props: Props) => (
  <div class="inline-flex shadow-sm rounded-md" role="group">
    <For each={props.options}>
      {(option, index) => (
        <button
          type="button"
          class={classNames(
            'bg-bgColor-primary text-textColor border-borderColor-primary text-sm font-medium px-4 py-1 h-8',
            {
              ['bg-bgColor-primary-hover']: option.value == props.selected,
              ['hover:bg-bgColor-primary-hover hover:border-borderColor-hover']:
                option.value != props.selected,
              ['rounded-l-lg border']: index() === 0,
              ['rounded-r-md border']: index() === props.options.length - 1,
              ['border-t border-b']:
                index() > 0 && index() < props.options.length - 1,
              ['border-l']: index() > 1 && index() < props.options.length - 1,
            }
          )}
          onClick={() =>
            option.value !== props.selected
              ? props.onChange(option.value)
              : undefined
          }
        >
          {option.text}
        </button>
      )}
    </For>
  </div>
);
