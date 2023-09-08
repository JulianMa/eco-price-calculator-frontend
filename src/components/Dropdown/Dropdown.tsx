import classNames from 'classnames';
import { createSignal, For } from 'solid-js';
import PortalMenuPosition, {
  CardinalPoint,
} from '../PortalMenuPosition/PortalMenuPosition';
import createOnClickOutside from '../../hooks/createOnClickOutside';

type Props = {
  value: string | number;
  values: { value: string | number; text: string; selectable?: boolean }[];
  onChange: (newValue: string | number) => void;
  origin?: CardinalPoint;
  direction?: CardinalPoint;
  class?: string;
};
export default (props: Props) => {
  const [isMenuOpen, setMenuOpen] = createSignal(false);
  const out = createOnClickOutside(() => setMenuOpen(false), isMenuOpen);

  const renderMenu = () =>
    isMenuOpen() ? (
      <div
        {...out}
        class={classNames(
          'bg-bgColor-primary text-textColor border-borderColor-primary w-56 rounded-md shadow-lg border transform focus:outline-none z-50',
          {
            ['transition ease-out duration-100 opacity-100 scale-100']:
              isMenuOpen(),
            ['transition ease-in duration-75 opacity-0 scale-95']:
              !isMenuOpen(),
          }
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <For each={props.values}>
            {(item) =>
              item.selectable !== false ? (
                <button
                  class={classNames(
                    'bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor block px-4 py-2 text-sm w-full text-left',
                    {
                      ['bg-bgColor-primary-hover']: item.value == props.value,
                    }
                  )}
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    props.onChange(item.value);
                  }}
                >
                  {item.text}
                </button>
              ) : (
                <div class="bg-bgColor-primary text-textColor block px-4 py-2 text-sm w-full text-left">
                  {item.text}
                </div>
              )
            }
          </For>
        </div>
      </div>
    ) : undefined;
  return (
    <PortalMenuPosition
      isMenuOpen={isMenuOpen}
      renderMenu={renderMenu}
      origin={props.origin}
      direction={props.direction}
    >
      <div class={classNames('inline-block text-left', props.class)}>
        <button
          type="button"
          class="bg-bgColor-primary hover:bg-bgColor-primary-hover text-textColor border-borderColor-primary hover:border-borderColor-hover inline-flex justify-center w-full rounded-md border h-8 px-2 py-1 text-sm font-small focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={(ev) => {
            setMenuOpen((prev) => !prev);
            ev.stopPropagation();
          }}
        >
          {props.values.find((t) => t.value == props.value)?.text}
          <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </PortalMenuPosition>
  );
};
