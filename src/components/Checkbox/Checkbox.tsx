import classNames from 'classnames';

type Props = {
  fieldId?: string;
  label: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  class?: string;
  left?: boolean;
};

export default (props: Props) => {
  const fieldId = props.fieldId ?? props.label.replaceAll(' ', '_');
  return (
    <div
      class={classNames(
        'flex items-start',
        {
          'flex-row': !props.left,
          'flex-row-reverse': props.left,
        },
        props.class
      )}
    >
      <div class="flex items-center h-5">
        <input
          id={fieldId}
          aria-describedby={fieldId}
          type="checkbox"
          class="bg-bgColor-primary hover:bg-bgColor-primary-hover border-borderColor-primary hover:border-borderColor-hover border h-4 w-4 rounded cursor-pointer focus:outline-none"
          onChange={(ev) => props.onChange(ev.currentTarget.checked)}
          checked={props.checked}
        />
      </div>
      <div class="text-sm px-2">
        <label
          for={fieldId}
          class="text-textColor-primary font-medium select-none cursor-pointer"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};
